import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dropdown } from 'primeng/dropdown';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { detallePedido, documentoFactura, estadosPedido, pedido, pedidoDetalleExcell, pedidoDetalleExcellV2, pedidosprov, proveedor } from '../../interfaces/mantenimiento-pedidos.interface';
import { MantenimientoPedidosService } from '../../services/mantenimiento-pedidos.service';
import { ManteniminetoFacturaProveedorService } from '../../services/mantenimineto-factura-proveedor.service';
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
import { DataUser } from 'src/app/modules/auth/interfaces/data-user.interface';
import { AuthState } from 'src/app/redux/auth/state/auth.state';
import { Store } from '@ngrx/store';
import { selectDataUser } from 'src/app/redux/auth/selectors/auth.selector';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import * as lodash from 'lodash';

const exportacionExcel_columna_oem : string = 'OEM';

const exportacionExcel_columna_codigoproducto : string = 'CODIGOPRODUCTO';

const exportacionExcel_columna_descripcionproducto : string = 'DESCRIPCION';

const exportacionExcel_columna_paisorigen : string = 'MARCA';

const exportacionExcel_columna_marca : string = 'PAIS';

const exportacionExcel_columna_cantidadpedido : string = 'CANTIDAD';

const exportacionExcel_columna_preciopedido : string = 'PRECIO';

enum opcionesVerificacionExistenciaProductoDetalle {
  NoExiste = 0, // Cuando el item que se va a evaluar no existe
  ExistePeroDebeModificarse = 1, // Cuando el item si existe pero de debera actualizar los valores
  ExisteExacto = 2, // Cuando el item existe y esta exactamente igual al item importado
};

enum opcionesCargarTodosLosDocumentos {
  cargarTodoPorPrimeraVez = 1,
  recargarTodo = 2,
  cargarTodosLosConfirmados = 3,
};

@Component({
  selector: 'app-mantenimiento-de-pedidos',
  templateUrl: './mantenimiento-de-pedidos.component.html',
  styleUrls: ['./mantenimiento-de-pedidos.component.scss']
})

export class MantenimientoDePedidosComponent {
  @ViewChild('codProveedor') codProveedorField !: ElementRef<HTMLInputElement>; // Esta variable solo sirve para hacer focus sobre el campo de codigo de proveedor cuando se necesita

  // * Forms
  public proveedorForm ?: FormGroup;

  public pedidoForm ?: FormGroup;

  // * Properties
  @ViewChild('codProveedor', {static: true}) codProveedor ?: ElementRef;

  @ViewChild('inputFiltro') inputFiltro ?: ElementRef;

  @ViewChild('numPedido', {static: true}) numPedido ?: Dropdown;

  @ViewChild('paisOrigen') paisOrigen ?: Dropdown;

  @ViewChild('prodmarca') prodmarca ?: Dropdown;

  public opcionesCargarTodosLosDocumentos : typeof opcionesCargarTodosLosDocumentos = opcionesCargarTodosLosDocumentos;
  
  public isExcelFile : boolean = false;

  public txtSpinner: string = 'Loading...';

  public placeholderpedido: string = '';

  public proveedor : proveedor | null = null;

  public pedido : pedido | null = null;

  public pedidoDetalle: detallePedido[] = [];

  public pedidoDetalleFilter: detallePedido[] = [];

  public estadosPedido : estadosPedido | null = null;

  public productosSeleccionados: detallePedido[] = [];

  public excellDetallePedido: pedidoDetalleExcellV2[] = [];   // ? V2 => Por el cambio en los datos de exportacion.

  public ToCantPedido: number = 0;

  public ToPrecioPedido: number = 0;

  public ToCantConfirmado: number = 0;

  public ToPrecioConfirmado: number = 0

  public readOnlyInputsDates = true;

  public habilitarColumnas = false;

  public allDetallesPedidosObtenidos = false;  // ? Bandera utilizada al obtener todos los registros de los detalles hechos a un proveedor

  public allDetallesPedidosConfirmadosObtenidos = false;  // ? Bandera utilizada al obtener todos los registros de los detalles hechos a un proveedor cuando los pedidos estan confirmados
  
  public newProduct ?: detallePedido;

  public newDocument ?: documentoFactura;

  public addProduct: boolean = false;

  public moverFactura: boolean = false;

  public productoAgregado: boolean = false;

  public documentoAgregado: boolean = false; 

  public listaPaisOrigenProductos: any[] = [];

  public listaMarcasProductos: any[] = [];

  public regexCodProd: RegExp = /^[a-zA-Z]+$|^[0-9]+$|^[a-zA-Z0-9]+$|^[a-zA-Z0-9 \- \_ \. \, \/ ]+$/;

  public selectedFilter: string = 'oem';

  dataUser !:  DataUser;

  private fechaActual : Date = new Date();
  
  public mostrarModalCerrarPedido : boolean = false;

  public itemsConCantidadConfirmadaNoFacturada : detallePedido[] = [];

  public posiblePedidoDestinoPostCierre : pedidosprov[] = [];

  public destinoPedidoPostCierre : pedidosprov | null = null;

  public datosProveedorCerrarPedido : proveedor | null = null;

  public detallePedidoDestino : detallePedido[] = [];
  
  public mostrarModalBuscarProveedor : boolean = false;

  public busquedaProveedorLista : proveedor[] = [];

  public busquedaProveedorSeleccionado : proveedor | null = null;
  
  // * Constructor
  constructor( 
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private mantenimientopedidosService: MantenimientoPedidosService,
    private manteniminetoFactProvService: ManteniminetoFacturaProveedorService,
    private authStore: Store<AuthState>,
    private alerta : AlertaService
  ) {
    this.authStore.select(selectDataUser).subscribe(data => {
      this.dataUser = data;
    });

    this.mantenimientopedidosService.getListaProveedores()
    .subscribe(
      ( data : proveedor[] ) => {
        this.busquedaProveedorLista = data;

        this.busquedaProveedorLista = this.busquedaProveedorLista.filter((item : proveedor) => {
          return item.codigoproveedor;
        });
      }
    );
  }
  
  ngOnInit(): void {
    this.proveedorForm = this.formBuilder.group({
      codproveedor: ['', [Validators.required, Validators.pattern(this.regexCodProd)]]
    });

    this.pedidoForm = this.formBuilder.group({
      numPedido: ['', [Validators.required, Validators.pattern(this.regexCodProd)]]
    });

    this.codProveedor?.nativeElement.focus();

    this.obtenerPaisesOrigen();
    this.obtenerMarcas();    
    this.cantidadPedidos(); 
  }

  //#region // * METODOS
  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent = (event: KeyboardEvent) : void => {
    if (event.code === 'F2') {
      this.mostrarModalBuscarProveedor = true;

      this.busquedaProveedorSeleccionado = null;
    }
  }
  
  public cancelarBusquedaProveedor = () : void => {
    this.mostrarModalBuscarProveedor = false;
    
    this.busquedaProveedorSeleccionado = null;
  }

  public seleccionarBusquedaProveedor = () : void => {
    this.buscarNuevoCodigo();

    this.proveedorForm?.get('codproveedor')?.setValue(this.busquedaProveedorSeleccionado?.codigoproveedor);

    this.obtenerProveedor();

    this.cancelarBusquedaProveedor();
  }

  public getValueOfEvent_busquedaProveedor = (event : Event) : any => {
    return (event.target as HTMLInputElement).value;
  }

  /**
   * @description: Metodo utilizado para mostrar u ocultar el Spinner.
   */
  public showSpinner = ( opt: boolean, txt: string = 'Loading...' ) : void => {
    this.txtSpinner = txt;
    
    ( opt ) ? this.spinner.show() : this.spinner.hide();
  }
  
  /**
   * @description Metodo que muestra la cantidad de pedidos que posee el proveedor.
   */
  public cantidadPedidos = () : void => { 
    this.placeholderpedido= `${ ( this.proveedor?.pedidosprov ) ? 'Pedidos: ' : 'Sin pedidos: ' } ${ (this.proveedor?.pedidosprov) ? this.proveedor?.pedidosprov?.length : 0  }` 
  }
  
  public filtrarElementosTabla = (valorFiltro : any) : void => {
    this.pedidoDetalleFilter = this.pedidoDetalle.filter( producto =>  {
      switch (this.selectedFilter) {
        case 'oem':
          return producto.oem?.toLowerCase().includes( valorFiltro.toLowerCase() );
        case 'codigoproducto':
          return producto.codigoproducto?.toLowerCase().includes( valorFiltro.toLowerCase() );
        case 'descripcion':
          return producto.descripcion?.toLowerCase().includes( valorFiltro.toLowerCase() );
        case 'numeropedido':
          return producto.numeropedido?.toLowerCase().includes( valorFiltro.toLowerCase() );
        default: 
          return '';
      }
    } );
  }
  
  /**
   * @description: Metodo encargado de volver a llenar / obtener el detalle del pedido.
   */
  public recargarDetallePedido = async () : Promise<void> => {
    this.pedidoDetalle = [];
    this.pedidoDetalleFilter = [];
    this.estadosPedido = null;
    this.productosSeleccionados = [];
    this.excellDetallePedido = [];
    this.habilitarColumnas = false;
    this.ToCantPedido = 0;
    this.ToPrecioPedido = 0;
    this.ToCantConfirmado = 0;
    this.ToPrecioConfirmado = 0;

    if( this.inputFiltro ) {
      this.inputFiltro.nativeElement.value = '';
    }

    await this.obtenerEstadosPedido();

    await this.obtenerDetallePedido();

    this.cantidadPedidos();
  }
  
  /**
   * @description: Metodo encargado de vaciar todos los datos y campos de Mantenimiento de Pedidos, para poder buscar uno nuevo.
   */
  public buscarNuevoCodigo = () : void => {
    this.proveedorForm?.reset();
    this.pedidoForm?.reset();
    this.proveedor = null;
    this.pedido = null;
    this.pedidoDetalle  = [];
    this.pedidoDetalleFilter = [];
    this.estadosPedido = null;
    this.productosSeleccionados = [];
    this.excellDetallePedido = [];
    this.ToCantPedido   = 0;
    this.ToPrecioPedido = 0;
    this.ToCantConfirmado = 0;
    this.ToPrecioConfirmado = 0;
    this.habilitarColumnas = false;
    this.allDetallesPedidosObtenidos = false;
    this.allDetallesPedidosConfirmadosObtenidos = false;

    if( this.inputFiltro ) {
      this.inputFiltro.nativeElement.value = '';
    }

    this.proveedorForm?.get('codproveedor')?.enable();
    this.pedidoForm?.get('numPedido')?.enable();  

    this.codProveedorField.nativeElement.focus();
    this.codProveedorField.nativeElement.select();

    this.codProveedor?.nativeElement.focus();

    this.cantidadPedidos();
  }
  
  /**
   * @description Metodo utilizado para convertir a mayuscula los datos ingresados en el numero de documento.
   */
  public convertirMayusculas = () : void => {
    if (!this.newDocument?.numerodocumento) return;
    this.newDocument.numerodocumento = this.newDocument?.numerodocumento.toUpperCase();
  }
  
  /**
   * @description: Metodo utilizado para habilitar la edicion de las columnas de la tabla.
   * @param habilitar 
   */
  public habilitarDeshabilitarColumnas = (habilitar : boolean) : void => {
    this.habilitarColumnas = habilitar;
  }
  
  /**
   * @description Metodo encargado de abrir el Dialog para agregar un nuevo producto
   */
  public dialogAgregarProducto = () : void => {
    this.productoAgregado = false;    // ? Permite realizar una validacion en el html
    this.addProduct = true;           // ? Variable qu condiciona la apertura de la ventana modal para agregar un documento de factura.
    this.newProduct = {               // ? Inicializacion del objeto para un nuevo producto
        numeropedido       : '',
        codigoproducto     : '',
        cantidad           : 0,
        codigoproveedor    : '',
        precio             : '0',
        oem                : '',
        descripcion        : '',
        cantidadpedido     : 0,
        preciopedido       : 0,
        ingresado          : false,
        paisorigenid       : '',
        marca              : '',
        cantidadcuadre     : 0,
        preciocuadre       : '',
        es_reemplazo       : false,
        costo_promedio     : '',
        utilidad_adicional : '',
        detalleid          : 0,
        // detalleid          : NULL, ANTES
        cantfacturada      : 0,
        cantfacturar     : 0,
    }
  }

  /**
   * @description Metodo encargado de abrir el Dialog para mover los productos seleccionados a una factura proveedor.
   */
  public dialogAgregarFactura = () : void => {
    this.newDocument = {
      codigoproveedor: ((this.allDetallesPedidosObtenidos) || (this.allDetallesPedidosConfirmadosObtenidos) ? this.proveedor?.codigoproveedor : this.pedido?.codigoproveedor) || '',
      // codigoproveedor: ((this.allDetallesPedidosObtenidos) ? this.proveedor?.codigoproveedor : this.pedido?.codigoproveedor) || '',
      // codigoproveedor: (this.allDetallesPedidosObtenidos) ? this.proveedor.codigoproveedor : this.pedido.codigoproveedor, ANTES
      numerodocumento: ''
      // numerodocumento: null, ANTES
    }

    this.documentoAgregado = false;  // ? Permite realizar una validacion en el html
    this.moverFactura = true;        // ? Variable qu condiciona la apertura de la ventana modal para agregar un documento de factura.
  }

  /**
   * @description Metodo encargado de cerrar la ventana modal.
   */
  public hideDialog = () : void => {
    this.addProduct = false;
    this.productoAgregado = false;

    this.moverFactura = false;
    this.documentoAgregado = false;
  }

  /**
   * @description Metodo utilizado para agregar un nuevo producto al detalle de pedido
   */
  public agregarProductoAlDetalle = () : void => {
    if( this.newProduct ) {
      if( ((! this.newProduct.oem) || (this.newProduct.oem === '')) ||
          ((! this.newProduct.codigoproducto) || (this.newProduct.codigoproducto === '')) || 
          ((! this.newProduct.descripcion) || (this.newProduct.descripcion === ''))
      ) {
        this.alerta.showError('Ingrese minimo el OEM, codigo y descripcion del producto');

        return ;
      }
      
      if( ! this.newProduct.cantidadpedido ) {
        this.newProduct.cantidadpedido = 0;
      }
      
      if( ! this.newProduct.preciopedido ) {
        this.newProduct.preciopedido = 0;
      }

      let prodInsertar = { ...this.newProduct };
      prodInsertar.codigoproveedor = this.pedido?.codigoproveedor || '';
      prodInsertar.numeropedido = this.pedido?.numeropedido || '';
  
      this.pedidoDetalle.push( prodInsertar );
  
      this.pedidoDetalleFilter = this.pedidoDetalleFilter;
      this.alerta.showSuccess('El producto fue añdido al detalle del pedido. Proceda a guardarlo!'/*, 'Mensaje!', {  positionClass: 'toast-top-right' }*/ );
      this.hideDialog();
    }
  }
  
  /**
   * @description Funcion que permite determinar el color a mostrar segun el estado de un pedido.
   * @param estado 
   * @returns 
   */
  public getClassEstado = (estado: string) : string => {
    let classEstado: string = '';

    switch ( estado ) {
      case 'e':
        classEstado = 'badge status-badge-blue';
      break;
      
      case 'p':
        classEstado = 'badge status-badge-celeste';
      break;
      
      case 'c':
        classEstado = 'badge status-badge-green ';
      break;
      
      case 't':
        classEstado = 'badge status-badge-orange';
      
      break;
      
      case 'd':
        classEstado = 'badge status-badge-red';
      break;
      
      case 'b':
        classEstado = 'badge status-badge-brown';
      break;
      
      case 'r':
        classEstado = 'badge status-badge-purple ';
      break;
      
      case 'i':
        classEstado = 'badge status-badge-red';
      break;
      
      case 'f':
        classEstado = 'badge status-badge-dark';
      break;
      
      default:
        classEstado = 'badge status-badge-gray';
      break;
    }

    return classEstado;
  }
  
  public establecerCantidadFacturar = (detalleid: number) : void => {
    if( this.estadosPedido?.estado_actual !== 'e' ) {
      const detalleIndex = this.pedidoDetalle.findIndex( ped => ped.detalleid === detalleid );
          
      // ? Si se tienen todos los registros y el pedido del producto no esta confirmado, no le calculamos la cantidad a facturar.
      if ( this.allDetallesPedidosObtenidos && ( this.pedidoDetalle[detalleIndex]?.estado !== 'c' )  ) {
        console.log( 'neles no se puede establecer la cantidad' );
        return;
      }

      this.pedidoDetalle[detalleIndex].cantfacturar = +this.pedidoDetalle[detalleIndex].cantidad - +this.pedidoDetalle[detalleIndex].cantfacturada;
      
      this.pedidoDetalleFilter = this.pedidoDetalleFilter;
    }
  }

  public agregaAFactura = async () : Promise<void> => {
    this.hideDialog();

    // ? Variable que define si el usuario desea añadir los productos a un documento de factura existente. 
    let agregarDocExistente: boolean = false; 
    let addDocExist : SweetAlertResult<unknown>;
    let userConfirm : SweetAlertResult<unknown>;
    let facturaproveedorid: number | null = null;
    let codigoempleado: string;

    if ( this.productosSeleccionados?.length === 0 ) {
      Swal.fire(  'Mensaje!', 'No tiene ningún producto seleccionado para ser agregado a un documento de factura.', 'warning' );
      return;
    }

    if (
      this.newDocument?.numerodocumento == null ||
      this.newDocument?.codigoproveedor == null || 
      this.newDocument?.numerodocumento?.length <= 0 ||
      this.newDocument?.codigoproveedor?.length <= 0
    ) {
      Swal.fire(  'Mensaje!', 'Debe ingresar un número de documento y código proveedor válido.', 'warning' );
      return;
    }
    
    this.manteniminetoFactProvService.getVerificarExisteDocumento(
      this.newDocument.numerodocumento,
      this.newDocument.codigoproveedor
    )
    .subscribe(
      async ( data : number ) => {
        // Si el documento YA existe
        if( data !== 0 ) {
          facturaproveedorid = data;
          
          addDocExist = await Swal.fire( 'Mensaje!', 'El número de documento ya existe para el proveedor proporcionado.', 'warning');      
          
          if ( addDocExist?.isConfirmed || addDocExist?.isDismissed) {
            userConfirm = await Swal.fire({
              title: '¿Desea añadir los productos al documento existente?',
              text: "Esta acción modificará los productos existentes y agregará los nuevos productos seleccionados que aún no estén en el detalle de la factura!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, agregar al documento!'
            });
          }
          
          if ( userConfirm && !userConfirm?.isConfirmed ) {
            facturaproveedorid = null;
            return;
          }
          else if ( userConfirm && userConfirm?.isConfirmed ) {
            agregarDocExistente = true;
          }
          
          if ( agregarDocExistente ) {
            this.showSpinner( true, 'Procesando los datos para la factura de proveedor...' );
            
            this.productosSeleccionados.forEach( async ( prod ) => {
              let disponibleFacturar:number = +prod.cantidad - +prod.cantfacturada;  // ? Cantidad confirmada menos la cantidad ya facturada.
              let cantidadFacturar: number = 0;
      
              if ( (prod.cantfacturar || 0) > 0 ) {
                cantidadFacturar = Math.min( +(prod.cantfacturar || 0), disponibleFacturar );
              }        
      
              if ( cantidadFacturar > 0 ) {
                this.manteniminetoFactProvService.insertDetalleFacturaProveedor(
                  facturaproveedorid || 0,
                  this.newDocument?.codigoproveedor || '',
                  prod.detalleid,
                  cantidadFacturar,
                  prod.precio
                )
                .subscribe(
                  ( data : any ) => { }
                );
              }
            });
          }
        }
         else {
          if (
            this.newDocument?.fechaemision === null ||
            this.newDocument?.fechaemision === undefined
          ) {
            Swal.fire(  'Mensaje!', 'Debe ingresar una fecha de emisión del documento.', 'warning' );
            return;
          }

          console.log( 'Añadiemos un nuevo documento de factura...' );
    
          userConfirm = await Swal.fire({
            title: '¿Desea insertar el nuevo documento de factura?',
            text: "Se creará el documento de factura donde su detalle será los productos selecciondos del detalle del pedido!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, crear documento de factura!'
          });
    
          if ( !userConfirm?.isConfirmed ) {
            return;
          }
    
          this.showSpinner( true, 'Procesando los datos para la factura de proveedor...' );
    
          codigoempleado = this.dataUser.codigoempleado;
          
          this.manteniminetoFactProvService.insertEncabezadoFacturaProveedor(
            this.newDocument?.numerodocumento || '',
            this.newDocument?.codigoproveedor || '',
            codigoempleado,
            this.newDocument?.fechaemision || new Date(),
            this.newDocument?.fechavencimiento || null
          )
          .subscribe(
            ( data : number ) => {
              facturaproveedorid = data;
        
              this.productosSeleccionados.forEach( async ( prod ) => {
                let disponibleFacturar = +prod.cantidad - +prod.cantfacturada;  // ? Cantidad confirmada menos la cantidad ya facturada.
                let cantidadFacturar: number = 0;
        
                if ( (prod.cantfacturar || 0) > 0 ) {
                  cantidadFacturar = Math.min( (prod.cantfacturar || 0), disponibleFacturar );
                }
        
                if ( cantidadFacturar > 0 ) {
                  this.manteniminetoFactProvService.insertDetalleFacturaProveedor(
                    facturaproveedorid || 0,
                    this.newDocument?.codigoproveedor || '',
                    prod.detalleid,
                    cantidadFacturar,
                    prod.precio
                  )
                  .subscribe(
                    ( data : any ) => { }
                  );
                }
              } );
            }
          );
        }
    
        this.showSpinner( false, '' );
        this.hideDialog();
    
        Swal.fire( 'Mensaje!', `Los registros han sido agregados la factura proveedor. Documento: ${ this.newDocument?.numerodocumento }`, 'success').then( (ok : any) => {
          if ( this.allDetallesPedidosObtenidos ) {

            this.productosSeleccionados = [];

            this.obtenerAllDetallesPedidos(2);
          } else {
            this.recargarDetallePedido() ;
          }
        } );
      }
    );
  }
  
  /**
   * @description Metodo que obtine las marcas de de los productos
   */
  public obtenerMarcas = async () : Promise<void> => {
    this.mantenimientopedidosService.getMarcasProductos()
    .subscribe(
      ( data : any[] ) => {
        this.listaMarcasProductos = data;
      }
    );
  }

  /**
   * @description Metodo que obtiene los paises de los proveedores de los productos
   */
  public obtenerPaisesOrigen = async () : Promise<void> => {
    this.mantenimientopedidosService.getPaisOrigenProductos()
    .subscribe(
      ( data : any[] ) => {
        this.listaPaisOrigenProductos = data;
      }
    );
  }

  /**
   * @description: Metodo encargado de buscar el proveedor del pedido. En base a un codigo de proveedor.
   * @returns 
   */
  public obtenerProveedor = async () : Promise<void> => {  
    if ( this.proveedorForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Código de proveedor!',text: 'Al parecer no ha ingresado un código de proveedor válido.'});

      return;
    };
    
    const codProveedor = this.proveedorForm?.controls?.['codproveedor']?.value;
    
    if ( !this.regexCodProd.test( codProveedor ) ) {
      Swal.fire({ icon: 'error', title: 'Código de proveedor!', text: 'Debe ingresar un código de proveedor válido.' });
      return;
    }
    
    this.showSpinner(true, 'Buscando datos del Proveedor');
    
    this.mantenimientopedidosService.getProveedor(
      codProveedor
    )
    .subscribe(
      ( data : proveedor ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.proveedorForm?.reset();
        //   this.showSpinner(false, '');
        //   return;
        // }

        this.proveedor = data;
    
        // ? Se deshabilita el input para que no se edite el dato y pasa el foco a numero de pedido
        this.proveedorForm?.get('codproveedor')?.disable();
        this.cantidadPedidos(); 
        this.numPedido?.focus();
        this.showSpinner(false, '');
      }
    );
  }

  /**
   * @description: Metodo encargado de buscar el pedido realizado a un proveedor. En base al numero de pedido y codigo de proveedor
   * @returns 
   */
  public obtenerPedido = async () : Promise<void> => {
    if ( this.proveedorForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Código de proveedor!',text: 'Al parecer no ha ingresado un código de proveedor válido.'});
      return;
    };

    if ( this.pedidoForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Número de Pedido!',text: 'Al parecer no ha ingresado un número de pedido válido.'});
      return;
    }

    const numeroPedido = this.pedidoForm?.controls?.['numPedido']?.value;

    if ( !this.regexCodProd.test(numeroPedido) ) {
      Swal.fire({ icon: 'error', title: 'Número de Pedido!', text: 'Debe ingresar un número de pedido válido.' });
      return;
    }

    this.showSpinner(true, 'Buscando datos del Pedido');
    
    this.mantenimientopedidosService.getPedido(
      this.proveedor?.codigoproveedor || '',
      numeroPedido
    )
    .subscribe(
      async ( data : pedido ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.pedidoForm?.reset();
        //   this.showSpinner(false, '');
        //   return;
        // }

        this.pedido = data;

        // ? Se deshabilita el input para que no se edite el dato y se obtiene el detalle del pedido
        this.pedidoForm?.get('numPedido')?.disable();   
        this.obtenerEstadosPedido();
        this.showSpinner(false, '');
        await this.obtenerDetallePedido();
      }
    );
  }

  /**
   * @description Metodo encargado de la obtencion del estado actual y proximo de un pedido.
   * @returns 
   */
  public obtenerEstadosPedido = async () : Promise<void> => {
    this.showSpinner( true, 'Obteniendo estados del pedido....' );
    
    this.mantenimientopedidosService.getEstadosPedido(
      this.pedido?.codigoproveedor || '',
      this.pedido?.numeropedido || ''
    )
    .subscribe(
      ( data : estadosPedido ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // } 
    
        this.estadosPedido = data;
        this.showSpinner( false, '' );
      }
    );
  }
  
  /**
   * @description: Metodo encargado de obtener el detalle de un pedido. En base a un numero de pedido y codigo de proveedor.
   * @returns 
   */
  public obtenerDetallePedido = async () : Promise<void> => {
    if ( this.pedidoForm?.status == 'INVALID' && this.proveedorForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Detalle de Pedido!',text: 'Debe ingresar un código de proveedor y número de pedido válido.'});
      return;
    };

    this.showSpinner(true, 'Obteniendo detalles del pedido');
    
    this.mantenimientopedidosService.getPedidoDetalle(
      this.proveedor?.codigoproveedor || '',
      this.pedido?.numeropedido || ''
    )
    .subscribe(
      ( data : detallePedido[] ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // } 

        this.pedidoDetalle = data;
        this.pedidoDetalleFilter = this.pedidoDetalle;
        
        this.obtenerCalculoCantitadTotalPedido();
        this.showSpinner(false, '');
      }
    );
  }
  
  /**
   * @description Metodo encargado de obtener los registros de todos los detalles de los pedidos realizados a un proveedor.
   * @returns 
   */
  public obtenerAllDetallesPedidos = async (opcion : opcionesCargarTodosLosDocumentos) : Promise<void> => {
    if ( this.pedidoForm?.status == 'INVALID' && this.proveedorForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Detalle de Pedido!',text: 'Debe ingresar un código de proveedor válido.'});
      return;
    };

    if ( opcion === opcionesCargarTodosLosDocumentos.cargarTodoPorPrimeraVez ) {
      const userConfirm = await Swal.fire({
        title: '¿Desea obtener los detalles de los pedidos?',
        text: `Se mostrará el detalle de los pedidos con estado: 'Pidiendo','Pedido a Proveedor' y 'Confirmado'; realizados al proveedor ${ this.proveedorForm?.value['codproveedor'] }`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, mostrar!'
      });
  
      if (!userConfirm.isConfirmed) return;
    }

    if ( opcion === opcionesCargarTodosLosDocumentos.cargarTodosLosConfirmados ) {
      const userConfirm = await Swal.fire({
        title: '¿Desea obtener los detalles de los pedidos confirmados?',
        text: `Se mostrará el detalle de los pedidos con estado: 'Confirmado'; realizados al proveedor ${ this.proveedorForm?.value['codproveedor'] }`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, mostrar!'
      });
  
      if (!userConfirm.isConfirmed) return;
    }

    this.showSpinner(true, 'Obteniendo detalles del pedido');
    
    this.mantenimientopedidosService.getAllPedidosDetalles(
      this.proveedor?.codigoproveedor || ''
    )
    .subscribe(
      ( data : detallePedido[] ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // }

        this.pedidoForm?.reset();        // ? Se resetea para que muestre la cantidad de pedidos.
        this.estadosPedido = null;      // ? Se establece a null por que no se tendra un pedido especifico.
        this.pedido = null;             // ? Se establece a null por que no se tendra un pedido especifico.
        
        if( this.inputFiltro ) {
          this.inputFiltro.nativeElement.value = '';
        }

        this.habilitarColumnas = false;

        this.pedidoDetalle = data;

        // Si la opcion recibida es para cargar todos los documentos, pero unicamente los confirmados...
        if( opcion === opcionesCargarTodosLosDocumentos.cargarTodosLosConfirmados ) {
          // Se realiza el filtrado correspondiente
          this.pedidoDetalle = this.pedidoDetalle.filter((item : detallePedido) => {
            return (item.estado || '').toLowerCase() === 'c'
          });

          this.allDetallesPedidosConfirmadosObtenidos = true;
        }
        else {
          this.allDetallesPedidosConfirmadosObtenidos = false;
        }

        this.pedidoDetalleFilter = this.pedidoDetalle;

        this.allDetallesPedidosObtenidos = true;
        console.log( "Todos los registros: ", this.allDetallesPedidosObtenidos );
        
        this.pedidoForm?.get('numPedido')?.disable();
        this.obtenerCalculoCantitadTotalPedido();
        this.showSpinner(false, '');
      }
    );
  }

  /**
   * @description: Metodo encargado de calcular los totales de la cantidad y precio pedidos y confirmados.
   */
  public obtenerCalculoCantitadTotalPedido = async () : Promise<void> => {
    let tCantidadPedido: number = 0;
    let tPrecioPedido: number = 0;
    let tCantidadConfirmado: number = 0;
    let tPrecioConfirmado: number = 0;

    this.pedidoDetalle.forEach( el => {
      tCantidadPedido += (+el.cantidadpedido);
      tPrecioPedido += ( (+el.cantidadpedido) * (+el.preciopedido) );  
      tCantidadConfirmado += (+el.cantidad);
      tPrecioConfirmado += ( (+el.cantidad) * (+el.precio) );
    } );

    this.ToCantPedido = tCantidadPedido;
    this.ToPrecioPedido = Math.round(tPrecioPedido * 100) / 100;

    this.ToCantConfirmado = tCantidadConfirmado;
    this.ToPrecioConfirmado = Math.round(tPrecioConfirmado * 100) / 100;
  }

  /**
   * @description: Metodo encargado de eliminar los registros seleccionadps por el usuario
   */
  public borrarRegistros = async () : Promise<void> => {
    if ( this.productosSeleccionados?.length == 0 ) {
      Swal.fire(  'Mensaje', 'No tiene productos seleccionados para eliminar!', 'warning' )
      return;
    }

    const userConfirm = await Swal.fire({
      title: '¿Desea eliminar los registros seleccionados?',
      text: "No podrá revertir esta acción!.  Los productos que tengan cantidad facturada no podrán ser eliminados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }); 

    if (!userConfirm.isConfirmed) return;

    this.showSpinner( true, 'Eliminando productos seleccionados...' );
    
    await this.productosSeleccionados?.forEach( (prod) => {
      this.mantenimientopedidosService.deletePedidoDetalle(
        prod.detalleid
      )
      .subscribe(
        ( _data : boolean ) => { }
      );
    });
    
    this.showSpinner( false, '' );

    Swal.fire(  '¡Eliminados!', 'Los productos seleccionados han sido eliminados.', 'success' ).then( ok => {
      this.recargarDetallePedido();
      this.cantidadPedidos();
    } );    
  }

  /**
   * @description: Metodo encargado de actualizar los registros del detalle del pedido
   */
  public actualizarRegistros = async () : Promise<void> => {
    let updatePD: detallePedido[] = [];
    let txtactualizar: string = '';

    if ( this.productosSeleccionados?.length > 0 ) {
      updatePD = this.productosSeleccionados;
      txtactualizar = '¿Desea actualizar los registros seleccionados?'
    }
    else {
      updatePD = this.pedidoDetalle;
      txtactualizar = '¿Desea actualizar todos los registros?'
    }

    const userConfirm = await Swal.fire({
      title: txtactualizar,
      text: "No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!'
    }); 

    if (!userConfirm.isConfirmed) return;

    this.showSpinner( true, 'Actualizando productos del Detalle del Pedido...' );
    
    // updatePD.forEach( async (ele) => {
    //   if ( ele?.detalleid <= 0 || ele?.detalleid == null ) {
    //     this.mantenimientopedidosService.insertPedidoDetalle(
    //       ele
    //     )
    //     .subscribe(
    //       ( data : boolean ) => {
    //         if ( data ) {
    //           this.alerta.showSuccess(`El producto fue insertado con éxito.`/*, 'Mensaje!', {  positionClass: 'toast-top-right' }*/ );
    //         } else {
    //           this.alerta.showError(`No se pudo agregar el producto a Pedido Detalle. El OEM '${ ele.oem }' y Codigo de producto '${ ele.codigoproducto }' ya existen.`/*, 'Mensaje!', { positionClass: 'toast-top-right' }*/ );
    //         }
    //         console.log( 'IN' );
    //       }
    //     );
    //   } else {
    //     this.mantenimientopedidosService.updatePedidoDetalle(
    //       ele
    //     )
    //     .subscribe(
    //       ( data : boolean ) => {
    //         if ( data ) {
    //           this.alerta.showSuccess(`El registro fue actualizado con éxito.`/*, 'Mensaje!', {  positionClass: 'toast-top-right' }*/ );
    //         } else {
    //           this.alerta.showError(`No se pudo actualizar el registro de Pedido Detalle.`/*, 'Mensaje!', { positionClass: 'toast-top-right' }*/ );
    //         }
    //         console.log( 'UP' );
    //       }
    //     );
    //   }
    // });

    let listaPromesas : Promise<boolean | undefined>[] = [];
    
    for (const ele of updatePD) {
      if ( ele?.detalleid <= 0 || ele?.detalleid == null ) {
        listaPromesas.push(
          this.mantenimientopedidosService.insertPedidoDetalle(ele).toPromise()
        );
      } else {
        listaPromesas.push(
          this.mantenimientopedidosService.updatePedidoDetalle(ele).toPromise()
        );
      }
    }
    
    await Promise.all(
      listaPromesas
    )
    .then((_res) => { });
    
    this.showSpinner( false, '' );
    Swal.fire(  '¡Actualizados!', 'Los productos han sido actualizados.', 'success' ).then( (ok : any) => {
      console.log( 'Hola Mundo' );
      console.log( updatePD );

      if ( this.allDetallesPedidosObtenidos ) {
        this.obtenerAllDetallesPedidos(2);
      } else {
        this.recargarDetallePedido();
      }
      this.cantidadPedidos();
    } );  
  }
  
  /**
   * @description Metodo utilizado para actualiar el estado del pedido.
   * @returns 
   */
  public actualizarEstadoPedido = async () : Promise<void> => {
    const codigoempleado = this.dataUser.codigoempleado;

    const nextStatus = this.estadosPedido?.proximoestado_descripcion;
    
    const userConfirm = await Swal.fire({
      title: '¿Desea actualizar el estado del pedido?',
      text: `El estado del pedido se cambiará a "${nextStatus}", no podrá revertir esta acción!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar!'
    }); 

    if (!userConfirm.isConfirmed) return;

    this.showSpinner( true, 'Actualizando el estado de la factura...! ' );
    
    this.mantenimientopedidosService.updateEstadoPedido(
      this.estadosPedido?.proximoestado || '',
      codigoempleado,
      this.pedido?.numeropedido || '',
      this.pedido?.codigoproveedor || ''
    )
    .subscribe(
      ( data : boolean ) => {
        if ( ! data ) {
          Swal.fire({ icon: 'warning', title: 'Mensaje', text: `No se pudo actualizar el registro con los datos proporcionados.` });
          this.showSpinner(false, '');
          return;
        }
    
        this.showSpinner(false, '');
        Swal.fire({icon: 'info', title: 'Mensaje', text: `El estado del pedido se cambió a "${ nextStatus }"`});
        this.obtenerPedido();
        this.obtenerEstadosPedido();
      }
    );
  }
  
  /**
   * @description: Metodo utilizado para pasar el valor de cantidad pedido y precio pedido a la cantidad confirmada y precio
   * confirmado por cada producto en el detalle del pedido, Y viceversa. 
   * @argument opcion1: Mueve la cantidad pedida y precio pedido a las cantidades y precios confirmados.
   * @argument opcion2: Mueve la canridad y precios confirmados a las cantidades pedida y precio pedido.
   * @returns
   */
  public cambiarCantidadConfirmadoYPedido = async (opcion: number) : Promise<void> => {

    let userConfirm : SweetAlertResult<unknown>;

    userConfirm = await Swal.fire({
      title: `¿Desea añadir los precios y cantidades de productos de 'Confirmado' a 'Pedido'?`,
      text: "Esta acción asignará los precios de los productos desde la seccion de 'Confirmado' a 'Pedido'. Esta accion es irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    });

    if ( (userConfirm) && (! userConfirm.isConfirmed) ) {
      return;
    }

    if ( this.pedidoDetalle?.length == 0 ) return;

    this.showSpinner( true, 'Moviendo todo el pedido a confirmado...' );

    this.mantenimientopedidosService.updatePasarPedidoConfirmadoViceversa(
      this.pedido?.codigoproveedor || '',
      this.pedido?.numeropedido || '',
      opcion
    )
    .subscribe(
      ( data : boolean ) => {
        if ( ! data ) {
          this.showSpinner( false, '' );
          return;
        }
    
        this.showSpinner( false, '' );
        this.recargarDetallePedido();
        this.obtenerCalculoCantitadTotalPedido();
      }
    );
  }
  
  /**
   * @description Metodo utilizado para establecer el valor de cantidad y precio confirmado a cero. 
   * @returns 
   */
  public cambiarConfirmadoCero = async () : Promise<void> => {
    if ( this.pedidoDetalle?.length == 0 ) return;

    this.showSpinner( true, 'Moviendo todo el pedido a confirmado...' );
    
    this.mantenimientopedidosService.updatePedidoConfirmadoCero(
      this.pedido?.codigoproveedor || '',
      this.pedido?.numeropedido || ''
    )
    .subscribe(
      ( data : boolean ) => {
        if ( ! data ) {
          this.showSpinner( false, '' );
          return;
        }
    
        this.showSpinner( false, '' );
        this.recargarDetallePedido();
        this.obtenerCalculoCantitadTotalPedido();
      }
    );
  }
  
  /**
   * @description: Metodo utilizado para importar los detalles de productos desde un documento excell
   * @param event 
   * @returns
   */
  public importarDatosExcell = async (event : any, inputFileEl: any) : Promise<void> => {
    try {
      this.showSpinner( true, 'Leyendo datos...' );

      // Se verifica que exista un proveedor y un numero de pedido seleccionado
      if ( (this.pedidoForm?.status === 'INVALID') || (this.proveedorForm?.status === 'INVALID') ) {
        this.showSpinner( false, '');

        await Swal.fire({ icon: 'warning',  title: 'Mensaje!',text: 'Debe ingresar un código de proveedor y número de pedido para importar un detalle de pedido (Factura).'});

        inputFileEl.clear();

        return;
      };
      
      // Se verifica si el modo de obtencion de detalles obtenidos sea solo por el pedido ingresado, y no por TODOS los pedidos
      if ( this.allDetallesPedidosObtenidos ) {
        // Y si es asi, si esta unicamente por todos los pedidos CONFIRMADOS
        if( ! this.allDetallesPedidosConfirmadosObtenidos ) {
          this.showSpinner( false, '');

          await Swal.fire({ icon: 'warning',  title: 'Mensaje!',text: 'Debe ingresar un código de proveedor y número de pedido para importar un detalle de pedido (Factura).'});

          inputFileEl.clear();

          return;
        }
      };
      
      const target : DataTransfer = <DataTransfer>(event);
      
      // Se verifica que solo se haya seleccionado un unico elemento
      if( target.files.length !== 1 ) {
        this.showSpinner( false, '');

        Swal.fire('Mensaje!', 'No puede seleccionar multiples archivos a la vez.', 'warning' ); 

        inputFileEl.clear();

        return ;
      }

      // Se verifica si el elemento seleccionado, es de tipo File
      if( ! (target.files[0] instanceof File) ) {
        this.showSpinner( false, '');

        Swal.fire('Mensaje!', 'El elemento seleccionado no es un archivo', 'warning' ); 

        inputFileEl.clear();

        return ;
      }

      // Se agarra el archivo seleccionado, la primera posicion
      const archivoSeleccionado : File = target.files[0];
      
      // Se verifica si el archivo recibido es de tipo EXCEL (extencion .xls y .xlsx)
      this.isExcelFile = !! archivoSeleccionado.name.match(/(.xls|.xlsx)/);
      
      if ( ! this.isExcelFile ) {
        this.showSpinner( false, '');

        Swal.fire('Mensaje!', `El archivo que ha seleccionado, al parecer no tiene la extension Excel.`, 'warning' );

        inputFileEl.clear();

        return ;
      }
      
      const reader : FileReader = new FileReader();
      
      reader.readAsBinaryString(archivoSeleccionado);

      reader.onload = async (e : any) => {
        // ? Leer workbook
        const workbook : xlsx.WorkBook = xlsx.read(e.target.result, { type: 'binary' });

        // ? SEGUN EXCEL, NUNCA VA A PASAR PERO MAS VALE PREVENIR QUE LAMENTAR :D
        // Se verifica si el archivo tenga minimo una hoja
        if( workbook.SheetNames.length === 0 ) {
          this.showSpinner( false, '');

          Swal.fire('Mensaje!', `El archivo Excel que ha seleccionado, no tiene ninguna hoja creada.`, 'warning' );
          
          inputFileEl.clear();

          return ;
        }

        // Obtenemos el nombre de la primer hoja del documento
        const worksheet_nombre : string = workbook.SheetNames[0];
        
        // Se verifica si el archivo tiene mas de una hoja
        if( workbook.SheetNames.length > 1 ) {
          this.showSpinner( false, '');

          let userConfirm : SweetAlertResult<unknown> = await Swal.fire({
            title: `El archivo Excel que ha seleccionado, tiene más de una hoja, por lo que se tomara en cuenta la información de hoja: ${worksheet_nombre}. Desea continuar?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí'
          });

          if ( (userConfirm) && (! userConfirm.isConfirmed) ) {
            inputFileEl.clear();

            return;
          }

          this.showSpinner( true, 'Leyendo datos...' );
        }
        
        // Agarrar la primera hoja, el primer Sheet
        const worksheet: xlsx.WorkSheet = workbook.Sheets[worksheet_nombre];

        // Guardar los datos en una variable
        const dataImportada : any[] = xlsx.utils.sheet_to_json(worksheet);

        // Se verifica si la informacion obtenida es diferente de 0
        if( dataImportada.length === 0 ) {
          this.showSpinner( false, '');

          inputFileEl.clear();

          Swal.fire('Mensaje!', 'Al parecer no se pudo leer datos en el archivo seleccionado.', 'warning' ); 
          
          return ;
        }
        
        // En este arreglo se almacenaran todos los headers / keys de los datos obtenidos del Excel
        // ? Un header / key es la primera fila de datos en un documento de Excel, es decir, para importar un archivo, el mismo debe tener una primer fila con el nombre de las columnas, por ejemplo: OEM, CODIGOPRODUCTO, PRECIO, etc.
        let todosLosHeaderDelExcel : string[] = [];
        
        // Se obtienen las cabeceras / keys de los objetos del excel
        // ? Se hace una iteracion para ir OBJETO por OBJETO de los datos totales obtenidos del excel, y una segunda iteracion para ir HEADER por HEADER de uno de estos OBJETOS
        // ? ya que no todos los objetos tiene la misma cantidad de headers, unos objetos tiene 5 headers y otros objetos puede tener 8 headers por ejemplo
        // ? entonces se realiza una doble iteracion ya que se deben obtener ABSOLUTAMENTE todas los headers presentes en el documento
        for (const dataItem of dataImportada) {
          let headerList : string[] = Object.keys(dataItem);
    
          for (const hederItem of headerList) {
            // Si el header aun no esta en la lista...
            if( ! todosLosHeaderDelExcel.includes(hederItem) ) {
              // se ingresa a la misma
              todosLosHeaderDelExcel.push(hederItem);
            }
          }
        }
        
        // Se verifica si se encontro alguna header en el documento importado
        if( todosLosHeaderDelExcel.length === 0 ) {
          this.showSpinner( false, '');

          inputFileEl.clear();

          Swal.fire('Mensaje!', 'No se encontro ninguna header / key en el archivo seleccionado', 'warning' ); 
          
          return ;
        }
        
        // Declaramos un arreglo con todos los headers que deben estar presentes en el documento
        // son estos headers con los que se trabaja para realizar la importacion
        let headersQueDebenEstarEnDocumento : string[] = [
          exportacionExcel_columna_oem,
          exportacionExcel_columna_codigoproducto,
          exportacionExcel_columna_descripcionproducto,
          exportacionExcel_columna_paisorigen,
          exportacionExcel_columna_marca,
          exportacionExcel_columna_cantidadpedido,
          exportacionExcel_columna_preciopedido
        ];

        // Se verifica que existan todos y cada uno de los headers minimos para la correcta importacion de los datos
        for (const headerFijo of headersQueDebenEstarEnDocumento) {
          if( ! todosLosHeaderDelExcel.includes(headerFijo) ) {
            this.showSpinner( false, '');

            inputFileEl.clear();

            Swal.fire(`El header ${headerFijo} no existe en el documento.`, `Los headers que deben estar presentes en el documento son: ${headersQueDebenEstarEnDocumento.join(', ')}`, 'warning' ); 
            
            return ;
          }
        }

        this.showSpinner( false, '');

        inputFileEl.clear();

        this.llenarTablaPedidoDetalle(dataImportada)
      }
    }
    catch( e : any ) {
      this.showSpinner( false, '');

      Swal.fire('Mensaje!', e.message, 'warning' );
      
      inputFileEl.clear();
    }
  }
  
  /**
   * @description: Metodo encargado de llenar la tabla del detalle de pedido. 
   */
  private llenarTablaPedidoDetalle = async (datosObtenidos : any[]) : Promise<void> => {
    // Obtenemos el proveedor que fue seleccionado por el usuario
    let codigoProveedor : string = this.proveedorForm?.get('codproveedor')?.value;

    // Obtenemos el numero de pedido que fue seleccionado por el usuario
    let numeroPedido : string = this.pedidoForm?.get('numPedido')?.value;

    // Se pide verificacion para comenzar la importacion
    const userConfirm = await Swal.fire({
      title: `Se encontraron ${datosObtenidos.length} productos en el documento Excel`,
      text: `¿Desea comenzar la importacion de los mismos al pedido ${numeroPedido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }); 

    if( ! userConfirm.isConfirmed ) {
      return ;
    }
    
    this.showSpinner( true, 'Leyendo datos...' );

    // Se inicializan 3 listas con detalles de los productos existentes, no existentes y actuazados en los detalles actuales del numero de pedido seleccionado
    let nuevosDetallesPedidos : detallePedido[] = [];

    let yaExistenEnDetallesPedidos : detallePedido[] = [];

    let itemsQueSiActualizaron : detallePedido[] = [];
    
    // Recorremos los datos obtenidos del Excel
    for (const itemFromExcel of datosObtenidos) {
      // Obtenemos los datos especificos segun las columnas proporcionadas
      let oem_fromExcel : string = itemFromExcel[exportacionExcel_columna_oem] || '';

      let codigoproducto_fromExcel : string = itemFromExcel[exportacionExcel_columna_codigoproducto] || '';

      let descripcionproducto_fromExcel : string = itemFromExcel[exportacionExcel_columna_descripcionproducto] || '';
      
      let paisorigen_fromExcel : string = itemFromExcel[exportacionExcel_columna_paisorigen] || '';

      let marcaproducto_fromExcel : string = itemFromExcel[exportacionExcel_columna_marca] || '';

      let cantidadpedido_fromExcel : string = itemFromExcel[exportacionExcel_columna_cantidadpedido] || '0';

      let preciopedido_fromExcel : string = itemFromExcel[exportacionExcel_columna_preciopedido] || '0';
      
      // Creamos un item en base a los datos especificos obtenidos
      let item : detallePedido = {
        numeropedido : numeroPedido,
        codigoproducto : codigoproducto_fromExcel,
        cantidad : parseFloat(cantidadpedido_fromExcel),         // ? La cantidad confirmada
        codigoproveedor : codigoProveedor,
        precio : preciopedido_fromExcel,                       // ? El precio confirmado
        oem : oem_fromExcel,
        descripcion : descripcionproducto_fromExcel,
        cantidadpedido : parseFloat(cantidadpedido_fromExcel),       // ? La cantidad pedido
        preciopedido : parseFloat(preciopedido_fromExcel),           // ? El precio pedido
        ingresado : false,
        paisorigenid : paisorigen_fromExcel,
        marca : marcaproducto_fromExcel,
        cantidadcuadre : 0,
        preciocuadre : '0',
        es_reemplazo : false,
        costo_promedio : '0',
        utilidad_adicional : '0',
        detalleid : -1,
        cantfacturada : 0    // ? La cantidad facturada
      };

      // Se verifica si el item recien creado existe, para ellos proporcionamos el OEM, el codigo del producto, y las cantidad y precios de pedido y confirmado
      let verificacionItemDetalle : opcionesVerificacionExistenciaProductoDetalle = this.verificarExisteProductoEnDetalle(item.oem, item.codigoproducto, item.cantidadpedido, item.preciopedido, item.cantidad, item.precio);
      
      // Si no existe, se debe agregar como un item nuevo
      if( verificacionItemDetalle === opcionesVerificacionExistenciaProductoDetalle.NoExiste ) {
        // Si no existe, lo colocamos en un arreglo de nuevos items (para contabilizar unicamente)
        nuevosDetallesPedidos.push(item);
        
        // Como se va a importar cuando el pedido seleccionado esta en estado CREACION : e
        if( this.estadosPedido?.estado_actual === 'e' ) {
          // Se establecen en 0, la cantidad y precio confirmado, solo debe ingresarse el valor obtenido de la cantidad y precio pedido
          item.cantidad = 0;
          item.precio = '0';

          // Resaltamos los campos de cantidad y precio pedido
          item.resaltar_nuevo_cantidad_pedido_en_tabla = true;
          item.resaltar_nuevo_precio_pedido_en_tabla = true;
          
          this.pedidoDetalle.push(item);
        }
        
        // Como se va a importar cuando el pedido seleccionado esta en estado PEDIDO : p
        if( this.estadosPedido?.estado_actual === 'p' ) {
          // Se establecen en 0, cantidad y precio de pedido, solo debe ingresarse el valor obtenido de la cantidad y precio confirmado
          item.cantidadpedido = 0;
          item.preciopedido = 0;

          // Resaltamos los campos de cantidad y precio pedido
          item.resaltar_nuevo_cantidad_confirmado_en_tabla = true;
          item.resaltar_nuevo_precio_confirmado_en_tabla = true;
          
          this.pedidoDetalle.push(item);
        }

        // ? Cuando el pedido seleccionado esta en estado CONFIRMADO : c, SE REALIZA OTRO PROCESO (proceso al final de esta misma funcion)
      }
      else {
        // Si ya existe, pero con informacion diferente
        if( verificacionItemDetalle === opcionesVerificacionExistenciaProductoDetalle.ExistePeroDebeModificarse ) {
          // lo colocamos en un arreglo correspondiente (para contabilizar unicamente)
          itemsQueSiActualizaron.push(item);

          // Se manda a actualizar las cantidades y precios de pedido y confirmado del item del detalle
          this.actualizarValoresProductoEnDetalle(item.oem, item.codigoproducto, item.cantidadpedido, item.preciopedido, item.cantidad, item.precio)
        }
        else {
          // De lo contrario, si ya existe con la misma informacion...
          if( verificacionItemDetalle === opcionesVerificacionExistenciaProductoDetalle.ExisteExacto ) {
            // lo colocamos en un arreglo correspondiente (para contabilizar unicamente)
            yaExistenEnDetallesPedidos.push(item);

            // ? Cuando el item EXISTE y su informacion es igual a la que se esta importando, no se hace nada con ese dato, unicamente se contabiliza
          }
        }
      }
    }

    let itemsNuevos_contabilizados : string = (nuevosDetallesPedidos.length === 0) ? '' : `Se importaron ${nuevosDetallesPedidos.length} al detalle de este pedido.`;

    let itemsActualizados_contabilizados : string = (itemsQueSiActualizaron.length === 0) ? '' : `Se actualizaron las cantidades y precios de ${itemsQueSiActualizaron.length} items del detalle de este pedido.`;

    let itemsIguales_contabilizados : string = (yaExistenEnDetallesPedidos.length === 0) ? '' : `${yaExistenEnDetallesPedidos.length} items tienen la misma informacion en ambos origenes de datos.`;

    if( (itemsNuevos_contabilizados.length !== 0) && ((this.estadosPedido?.estado_actual === 'e') || (this.estadosPedido?.estado_actual === 'p')) ) {
      this.alerta.showSuccess(`${itemsNuevos_contabilizados}`);
    }

    if( (itemsActualizados_contabilizados.length !== 0) ) {
      this.alerta.showSuccess(`${itemsActualizados_contabilizados}`);
    }

    if( (itemsIguales_contabilizados.length !== 0) && ((this.estadosPedido?.estado_actual === 'e') || (this.estadosPedido?.estado_actual === 'p') || (this.estadosPedido?.estado_actual === 'c')) ) {
      this.alerta.showSuccess(`${itemsIguales_contabilizados}`);
    }

    this.showSpinner( false, '');
    
    // Luego de terminar el proceso de importacion, se hace el proceso que se debe seguir con los nuevos items en un pedido confirmado
    if( this.estadosPedido?.estado_actual === 'c' ) {
      // ? Cuando hay items nuevos pero el pedido esta en CONFIRMADO, se debe preguntar si se desea exportar el listado de estos items a un nuevo excel

      // Se verifica si existen nuevos items que se debieron ingresar pero por ser pedido confirmado no se ingresaron
      if( nuevosDetallesPedidos.length !== 0 ) {
        const userConfirm = await Swal.fire({
          title: `Existen ${nuevosDetallesPedidos.length} productos nuevos que no se ingresaron ya que el pedido esta en modo confirmado.`,
          text: `¿Desea exportarlos a un documento Excel?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí'
        }); 
    
        if( ! userConfirm.isConfirmed ) {
          return ;
        }

        let dataExportar : any[] = [];

        for (const iterator of nuevosDetallesPedidos) {
          dataExportar.push({
            OEM: iterator.oem,
            CODIGOPRODUCTO: iterator.codigoproducto,
            DESCRIPCION: iterator.descripcion,
            MARCA: iterator.marca,
            PAIS: iterator.paisorigenid,
            CANTIDADPEDIDO: iterator.cantidadpedido,
            PRECIOPEDIDO: iterator.preciopedido,
            CANTIDAD: iterator.cantidad,
            PRECIO: iterator.precio,
            SELECCIONAR: false,
            TIPO_SUGERENCIA: 0,
            FECHA_ULTIMA_INTERACCION: null,
            ULTIMA_INTERACCION: "",
            INVENTARIO: 0
          });
        }
        
        const worksheet = xlsx.utils.json_to_sheet(dataExportar);
        
        const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
        
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        this.saveAsExcelFile(excelBuffer, `Productos exedentes importados al Pedido ${ this.pedido?.numeropedido } Proveedor ${ this.proveedor?.codigoproveedor } `);
      }
    }
  }
  
  /**
   * @description: Metodo verificar si un producto existe en el detalle del pedido seleccionado
   */
  private verificarExisteProductoEnDetalle = (oem : string, codigoproducto : string, cantidadpedido_fromExcel : number, preciopedido_fromExcel : number, cantidadconfirmado_fromExcel : number, precioconfirmado_fromExcel : string) : opcionesVerificacionExistenciaProductoDetalle => {
    for (const detalleItem of this.pedidoDetalle) {
      if( ((detalleItem.oem.trim() === oem.trim()) && (detalleItem.codigoproducto.trim() === codigoproducto.trim())) ) {
        // Verifica la cantidad y precio pedido si el pedido esta en estado CREACION : e
        if( this.estadosPedido?.estado_actual === 'e' ) {
          if( (detalleItem.cantidadpedido !== cantidadpedido_fromExcel) ||
              (detalleItem.preciopedido !== preciopedido_fromExcel)
            )
          {
            return opcionesVerificacionExistenciaProductoDetalle.ExistePeroDebeModificarse;
          }
        }
        
        // Verifica la cantidad y precio confirmado si el pedido esta en estado PEDIDO : p
        if( (this.estadosPedido?.estado_actual === 'p') ) {
          // Si eta en pedido, practicamente SI o Si debe actualizarse para sincronizarse con el Excel proporcionado
          return opcionesVerificacionExistenciaProductoDetalle.ExistePeroDebeModificarse;

          // if( (detalleItem.cantidadpedido !== cantidadpedido_fromExcel) ||
          //     (detalleItem.preciopedido !== preciopedido_fromExcel)
          //   )
          // {
          //   return opcionesVerificacionExistenciaProductoDetalle.ExistePeroDebeModificarse;
          // }
        }
        
        // Verifica la cantidad y precio confirmado si el pedido esta en estado CONFIRMADO : c
        // if( (this.estadosPedido?.estado_actual === 'c') ) {
        //   if( (detalleItem.cantidadpedido !== cantidadpedido_fromExcel) ||
        //       (detalleItem.preciopedido !== preciopedido_fromExcel) ||
        //       (detalleItem.cantidad !== cantidadconfirmado_fromExcel) ||
        //       (detalleItem.precio !== precioconfirmado_fromExcel)
        //     )
        //   {
        //     return opcionesVerificacionExistenciaProductoDetalle.ExistePeroDebeModificarse;
        //   }
        // }
        
        return opcionesVerificacionExistenciaProductoDetalle.ExisteExacto;
      }
    }

    return opcionesVerificacionExistenciaProductoDetalle.NoExiste;
  }
  
  /**
   * @description: Metodo actualizar las cantidades y precios de pedido y conformado segun el estado del pedido seleccionado
   */
  private actualizarValoresProductoEnDetalle = (oem : string, codigoproducto : string, cantidadpedido_fromExcel : number, preciopedido_fromExcel : number, cantidadconfirmado_fromExcel : number, precioconfirmado_fromExcel : string) : void => {
    for (const detalleItem of this.pedidoDetalle) {
      if( ((detalleItem.oem.trim() === oem.trim()) && (detalleItem.codigoproducto.trim() === codigoproducto.trim())) ) {
        
        // Cuando el estado del pedido es CREACION : e, unicamente se actualiza la cantidad y precio pedido
        if( this.estadosPedido?.estado_actual === 'e' ) {
          if( detalleItem.cantidadpedido !== cantidadpedido_fromExcel ) {
            detalleItem.resaltar_modificado_cantidad_pedido_en_tabla = true;
          }

          if( detalleItem.preciopedido !== preciopedido_fromExcel ) {
            detalleItem.resaltar_modificado_precio_pedido_en_tabla = true;
          }

          detalleItem.cantidadpedido = cantidadpedido_fromExcel;

          detalleItem.preciopedido = preciopedido_fromExcel;
        }
        
        // Cuando el estado del pedido es PEDIDO : p, unicamente se actualiza la cantidad y precio confirmado
        if( (this.estadosPedido?.estado_actual === 'p') ) {
          if( detalleItem.cantidadpedido !== cantidadpedido_fromExcel ) {
            detalleItem.resaltar_modificado_cantidad_confirmado_en_tabla = true;
          }

          if( detalleItem.preciopedido !== preciopedido_fromExcel ) {
            detalleItem.resaltar_modificado_precio_confirmado_en_tabla = true;
          }

          detalleItem.cantidad = cantidadpedido_fromExcel;

          detalleItem.precio = preciopedido_fromExcel.toString();
        }
        
        // Cuando el estado del pedido es CONFORMADO : c, se actualizan ambos valores
        // if( (this.estadosPedido?.estado_actual === 'c') ) {
        //   if( detalleItem.cantidadpedido !== cantidadpedido_fromExcel ) {
        //     detalleItem.resaltar_modificado_cantidad_pedido_en_tabla = true;
        //   }

        //   if( detalleItem.preciopedido !== preciopedido_fromExcel ) {
        //     detalleItem.resaltar_modificado_precio_pedido_en_tabla = true;
        //   }
          
        //   if( detalleItem.cantidad !== cantidadconfirmado_fromExcel ) {
        //     detalleItem.resaltar_modificado_cantidad_confirmado_en_tabla = true;
        //   }

        //   if( detalleItem.precio !== precioconfirmado_fromExcel ) {
        //     detalleItem.resaltar_modificado_precio_confirmado_en_tabla = true;
        //   }
          
        //   detalleItem.cantidadpedido = cantidadpedido_fromExcel;

        //   detalleItem.preciopedido = preciopedido_fromExcel;

        //   detalleItem.cantidad = cantidadconfirmado_fromExcel;

        //   detalleItem.precio = precioconfirmado_fromExcel;
        // }
      }
    }
  }
  
  /**
   * @description: Metodo utilizado para dar formato a un nuevo producto que proviene desde un Excel importado.
   * @param producto 
   * @returns 
   */
  public formatoNuevoProducto = (producto: pedidoDetalleExcell) : detallePedido => {
  // formatoNuevoProducto( producto: pedidoDetalleExcell ) {
    let formatoProducto:detallePedido = {
        numeropedido       : this.pedido?.numeropedido || '',
        codigoproducto     : producto['CODIGO PRODUCTO'],
        cantidad           : 0, // producto.CANT,         // ? La cantidad confirmada, se mostrara en 0 en la importacion. 
        codigoproveedor    : this.proveedor?.codigoproveedor || '',
        precio             : '0', //`${producto.PRECIO}`, // ? El precio confirmado, se mostrara en 0 en la importacion.
        oem                : producto?.OEM,
        descripcion        : `${ producto?.DESCRIPCION ? producto?.DESCRIPCION : '' }`,
        cantidadpedido     : producto.CANT,
        preciopedido       : producto.PRECIO,
        ingresado          : false,
        paisorigenid       : (producto.PAISORIGEN) ? producto.PAISORIGEN : '',
        marca              : (producto.MARCA) ? producto.MARCA : '',
        cantidadcuadre     : 0,
        preciocuadre       : '0',
        es_reemplazo       : false,
        costo_promedio     : '0',
        utilidad_adicional : '0',
        detalleid          : -1,
        cantfacturada      : 0,
    };
    
    return formatoProducto;
  }

  // *  Exportar Grid a Excel
  /**
   * @description: Metodo utilizado para exportar el detalle de pedido a un excel.
   * @returns 
   */
  public exportarPedidoDetalle = async () : Promise<void> => {
    let tipo_pedido = ( this.pedido?.estado == 'e' ) ? 1 : 2;  // ? "1" Toma cantidadpedido y preciopedido, "2" Toma cantidad y precio confirmados.   // La funcion se modifico 08-03-2023 - Peticion el Ing. Carlos
    
    this.showSpinner(true, 'Obteniendo datos para exportar!');
    
    this.mantenimientopedidosService.getExportarPedidoDetalle(
      this.pedido?.codigoproveedor || '',
      this.pedido?.numeropedido || '',
      tipo_pedido
    )
    .subscribe(
      ( data : pedidoDetalleExcellV2[] ) => {
        // if ( ! resp?.success ) {
        //   console.log('Ocurrio error al obtener los datos.');
        //   Swal.fire({ icon: 'error', title: 'Error', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // }

        if ( data.length == 0 ) { 
          console.log('No se obtuvieron datos para exportar');
          Swal.fire({ icon: 'warning', title: 'Mensaje', text: 'No se obtuvieron datos para exportar'});
          this.showSpinner(false, '');
          return;
        }
    
        this.excellDetallePedido = data;
        this.showSpinner(false, '');
        this.exportExcel();
      }
    );
  }

  /**
   * @description: Metodo encargado de exportar el detalle del pedido a un formato excell.
   */
  public exportExcel = () : void => {
    const worksheet = xlsx.utils.json_to_sheet(this.excellDetallePedido);
    const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, `Detalle de Pedido ${ this.pedido?.numeropedido } Proveedor ${ this.proveedor?.codigoproveedor } `);
  }

  /**
   * @description: Metodo encargado de definir la ruta de guardado para el documento en excell.
   * @param buffer 
   * @param fileName 
   */
  public saveAsExcelFile = (buffer: any, fileName: string) : void => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      // let EXCEL_EXTENSION = '.xlsx';
      let EXCEL_EXTENSION = '.xls';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

      FileSaver.saveAs(data, fileName + '_' + new Date().getTime()  + EXCEL_EXTENSION);
  }

  /**
   * @description: Metodo para obtener la fecha actual para filtrar informacion como la creacion de un nuevo documento
   */
  public obtenerFechaActual = () : Date => {
    return this.fechaActual;
  }

  /**
   * @description: Metodo para cerrar y cancelar el cierre de un pedido
   */
  public cancelarCierrePedido = () : void => {
    this.mostrarModalCerrarPedido = false;

    this.itemsConCantidadConfirmadaNoFacturada = [];

    this.posiblePedidoDestinoPostCierre = [];

    this.destinoPedidoPostCierre = null;

    this.datosProveedorCerrarPedido = null;

    this.detallePedidoDestino = [];
  }

  /**
   * @description: Metodo para cerrar un pedido cuando la cantidad facturada nunca llega al total
   */
  public mostrarModalCerrarPedidoNoFacturado = async () : Promise<void> => {
    // Se verifica que exista un proveedor y un numero de pedido seleccionado, asi mismo que el modo de obtencion de detalles obtenidos sea solo por el pedido ingresado, y no por TODOS los pedidos
    if ( (this.pedidoForm?.status === 'INVALID') || (this.proveedorForm?.status === 'INVALID') || (this.allDetallesPedidosObtenidos) ) {
      await Swal.fire({ icon: 'warning',  title: 'Mensaje!',text: 'Debe ingresar un código de proveedor y número de pedido seleccionado.'});

      return;
    };
    
    // Si la tabla de detalles esta vacia
    if( this.pedidoDetalle.length === 0 ) {
      this.alerta.showWarning('No hay productos para evaluar, el detalle de este pedido esta vacia.');

      return ;
    }

    // Obtenemos los items cuya cantidad confirmada sea mayor a la cantidad facturada
    this.itemsConCantidadConfirmadaNoFacturada = lodash.cloneDeep(this.pedidoDetalle.filter((item : detallePedido) => {
      return item.cantidad > item.cantfacturada;
    }));

    if( this.itemsConCantidadConfirmadaNoFacturada.length === 0 ) {
      this.alerta.showWarning('No hay productos pendientes para cerrar este pedido. Todo fue entregado y facturado.');

      return ;
    }

    // Establecemos en 0 la cantidad facturada y restamos a la cantidad confirmada la cantidad facturada (nos quedamos con lo que nunca fue recibido).
    for (const itemProducto of this.itemsConCantidadConfirmadaNoFacturada) {
      itemProducto.cantidad = itemProducto.cantidad - itemProducto.cantfacturada;
      
      itemProducto.cantfacturada = 0;
    }
    
    // Obtenemos el proveedor que fue seleccionado por el usuario y obtemos la informacion del mismo
    let codigoProveedor : string = this.proveedorForm?.get('codproveedor')?.value || '';

    this.mantenimientopedidosService.getProveedor(
      codigoProveedor
    )
    .subscribe(
      ( data : proveedor ) => {
        this.datosProveedorCerrarPedido = data;

        // Lista de pedidos que se encuentran actualmente en estado 'Creacion'
        this.posiblePedidoDestinoPostCierre = this.datosProveedorCerrarPedido.pedidosprov.filter((item : pedidosprov) => {
          return item.estado === 'e';
        });

        // Verifica si la lista de posibles pedidos en estado CREACION esta vacia
        if( this.posiblePedidoDestinoPostCierre.length === 0 ) {
          this.alerta.showWarning('No hay ningún pedido en estado creación en este momento.');

          return ;
        }

        // Si el listado de posibles pedidos en estado CREACION solo es uno, se selecciona el mismo automaticamente.
        if( this.posiblePedidoDestinoPostCierre.length === 1 ) {
          this.destinoPedidoPostCierre = this.posiblePedidoDestinoPostCierre[0];
        }

        this.mostrarModalCerrarPedido = true;
      }
    );
  }
  
  /**
   * @description: Metodo para cerrar un pedido cuando la cantidad facturada nunca llega al total
   */
  public cerrarPedido = async () : Promise<void> => {
    this.mostrarModalCerrarPedido = false;

    // Se verifica si se selecciono un pedido de destino
    if( ! this.destinoPedidoPostCierre ) {
      this.alerta.showWarning('Seleccione un pedido de destino.');
      
      this.mostrarModalCerrarPedido = true;

      return ;
    }

    // Se verifica si el pedido seleccionado esta en estado CREACION
    if( this.destinoPedidoPostCierre.estado !== 'e' ) {
      this.alerta.showWarning('El pedido de destino seleccionado debe estar en estado: Creacion');

      this.mostrarModalCerrarPedido = true;
      
      return ;
    }

    // Pide confirmacion para cerrar el pedido
    const userConfirm = await Swal.fire({
      title: `Confirmación`,
      text: `¿Seguro que desea cerrar el pedido y trasladar todos los productos no facturados del pedido ${this.pedidoForm?.get('numPedido')?.value} al ${this.destinoPedidoPostCierre.numeropedido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    });

    if( ! userConfirm.isConfirmed ) {
      this.cancelarCierrePedido();

      return ;
    }
    
    let codigoProveedor : string = this.proveedorForm?.get('codproveedor')?.value || '';

    // Se mandan a traer los detalles del pedido destino
    this.mantenimientopedidosService.getPedidoDetalle(
      codigoProveedor,
      this.destinoPedidoPostCierre.numeropedido
    )
    .subscribe(
      async ( data : detallePedido[] ) => {
        this.detallePedidoDestino = data;
        
        // Recorremos los datos obtenidos
        for (const itemCierrePedido of this.itemsConCantidadConfirmadaNoFacturada) {
          // Creamos un item en base a los datos especificos obtenidos
          let item : detallePedido = {
            numeropedido : this.destinoPedidoPostCierre?.numeropedido || '',
            codigoproducto : itemCierrePedido.codigoproducto,
            cantidad : itemCierrePedido.cantidad,         // ? La cantidad confirmada
            codigoproveedor : itemCierrePedido.codigoproveedor,
            precio : itemCierrePedido.precio,                       // ? El precio confirmado
            oem : itemCierrePedido.oem,
            descripcion : itemCierrePedido.descripcion,
            cantidadpedido : itemCierrePedido.cantidadpedido,       // ? La cantidad pedido
            preciopedido : itemCierrePedido.preciopedido,           // ? El precio pedido
            ingresado : false,
            paisorigenid : itemCierrePedido.paisorigenid,
            marca : itemCierrePedido.marca,
            cantidadcuadre : 0,
            preciocuadre : '0',
            es_reemplazo : false,
            costo_promedio : '0',
            utilidad_adicional : '0',
            detalleid : -1,
            cantfacturada : 0    // ? La cantidad facturada
          };

          // Se verifica si el item recien creado existe, para ellos proporcionamos el OEM y el codigo del producto
          let verificacionItemDetalle : opcionesVerificacionExistenciaProductoDetalle = this.verificarExisteProductoEnDetalle_cerrarPedido(item.oem, item.codigoproducto);
          
          // Si no existe, se debe agregar como un item nuevo
          if( verificacionItemDetalle === opcionesVerificacionExistenciaProductoDetalle.NoExiste ) {
            this.detallePedidoDestino.push(item);
            
            console.log('agregando no existe en pedido destino ...');
            // console.log(item)
          }
          else {
            this.actualizarCantidadConfirmadaProductoEnDetalle(item.oem, item.codigoproducto, item.cantidad);

            console.log('actualizando cantidad confirmada en pedido destino ...');
            // console.log(item)
          }
        }

        this.showSpinner( true, 'Actualizando productos del Detalle del Pedido...' );

        let listaPromesas : Promise<boolean | undefined>[] = [];

        for (const ele of this.detallePedidoDestino) {
          if ( ele?.detalleid <= 0 || ele?.detalleid == null ) {
            listaPromesas.push(
              this.mantenimientopedidosService.insertPedidoDetalle(ele).toPromise()
            );
          } else {
            listaPromesas.push(
              this.mantenimientopedidosService.updatePedidoDetalle(ele).toPromise()
            );
          }
        }
    
        await Promise.all(
          listaPromesas
        )
        .then((_res) => { });
        
        this.mantenimientopedidosService.updateEstadoPedido(
          'x',
          this.dataUser.codigoempleado,
          this.pedido?.numeropedido || '',
          this.pedido?.codigoproveedor || ''
        )
        .subscribe(
          ( data : boolean ) => {
            if ( ! data ) {
              this.alerta.showWarning('El estado no se pudo actualizar');
            }

            this.alerta.showSuccess('Proceso terminado');
        
            this.showSpinner( false, '' );
            
            this.cancelarCierrePedido();

            this.recargarDetallePedido();
          }
        );
      }
    );
  }
  
  /**
   * @description: Metodo verificar si un producto existe en el detalle del pedido seleccionado para cierre
   */
  private verificarExisteProductoEnDetalle_cerrarPedido = (oem : string, codigoproducto : string) : opcionesVerificacionExistenciaProductoDetalle => {
    for (const detalleItem of this.detallePedidoDestino) {
      if( ((detalleItem.oem.trim() === oem.trim()) && (detalleItem.codigoproducto.trim() === codigoproducto.trim())) ) {
        return opcionesVerificacionExistenciaProductoDetalle.ExisteExacto;
      }
    }

    return opcionesVerificacionExistenciaProductoDetalle.NoExiste;
  }
  
  /**
   * @description: Metodo actualizar las cantidades y precios de pedido y conformado segun el estado del pedido seleccionado
   */
  private actualizarCantidadConfirmadaProductoEnDetalle = (oem : string, codigoproducto : string, agregarCantidad : number) : void => {
    for (const detalleItem of this.detallePedidoDestino) {
      if( ((detalleItem.oem.trim() === oem.trim()) && (detalleItem.codigoproducto.trim() === codigoproducto.trim())) ) {
        
        detalleItem.cantidad += agregarCantidad;

        console.log(detalleItem)
      }
    }
  }
  
  /**
   * @description: Metodo para exportar a Excel los productos que se estan exportando a otro pedido
   */
  public exportarProductosCierrePedido = async () : Promise<void> => {
    this.mostrarModalCerrarPedido = false;

    const userConfirm = await Swal.fire({
      title: `¿Desea exportar estos productos a un documento Excel?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }); 

    if( ! userConfirm.isConfirmed ) {
      this.mostrarModalCerrarPedido = true;

      return ;
    }
    
    let dataExportar : any[] = [];

    for (const iterator of this.itemsConCantidadConfirmadaNoFacturada) {
      dataExportar.push({
        OEM: iterator.oem,
        CODIGOPRODUCTO: iterator.codigoproducto,
        DESCRIPCION: iterator.descripcion,
        MARCA: iterator.marca,
        PAIS: iterator.paisorigenid,
        CANTIDADPEDIDO: iterator.cantidadpedido,
        PRECIOPEDIDO: iterator.preciopedido,
        CANTIDAD: iterator.cantidad,
        PRECIO: iterator.precio,
        SELECCIONAR: false,
        TIPO_SUGERENCIA: 0,
        FECHA_ULTIMA_INTERACCION: null,
        ULTIMA_INTERACCION: "",
        INVENTARIO: 0
      });
    }
    
    const worksheet = xlsx.utils.json_to_sheet(dataExportar);
    
    const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    this.saveAsExcelFile(excelBuffer, `Productos exedentes exportados desde Pedido ${ this.pedido?.numeropedido } al ${this.destinoPedidoPostCierre?.numeropedido} Proveedor ${ this.proveedor?.codigoproveedor } `);

    this.mostrarModalCerrarPedido = true;
  }
  //#endregion // * METODOS
}























