import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import Swal from 'sweetalert2';
import { proveedor } from '../../interfaces/mantenimiento-pedidos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dropdown } from 'primeng/dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { MantenimientoPedidosService } from '../../services/mantenimiento-pedidos.service';
import { ManteniminetoFacturaProveedorService } from '../../services/mantenimineto-factura-proveedor.service';
import { detalleFacturaProvExcellV2, estadosFactura, facturaProveedor, facturaProveedorDetalle } from '../../interfaces/mantenimiento-factura-proveedor.interface';
import { AuthState } from 'src/app/redux/auth/state/auth.state';
import { Store } from '@ngrx/store';
import { selectDataUser } from 'src/app/redux/auth/selectors/auth.selector';
import { DataUser } from 'src/app/modules/auth/interfaces/data-user.interface';

@Component({
  selector: 'app-mantenimiento-de-facturas-proveedor',
  templateUrl: './mantenimiento-de-facturas-proveedor.component.html',
  styleUrls: ['./mantenimiento-de-facturas-proveedor.component.scss']
})

export class MantenimientoDeFacturasProveedorComponent {
  @ViewChild('codProveedor') codProveedorField !: ElementRef<HTMLInputElement>; // Esta variable solo sirve para hacer focus sobre el campo de codigo de proveedor cuando se necesita

  // * Forms
  public documentoFacturaForm ?: FormGroup;
  public proveedorForm ?: FormGroup;

  // * Properties
  @ViewChild('codProveedor', {static: true}) codProveedor ?: ElementRef;
  @ViewChild('numDocumento', {static: true}) numDocumento ?: Dropdown;

  dataUser !:  DataUser;

  public txtSpinner: string = 'Loading...';
  public placeholderdocumento : string = '';
  public proveedor : proveedor | null = null;
  public facturaProveedor : facturaProveedor | null = null;
  public facturaProveedorDetalle : facturaProveedorDetalle[] = [];
  public estadosFacturaProv : estadosFactura | null = null;
  
  public productosSeleccionados : facturaProveedorDetalle[] = [];
  public excellDetalleFacturaProv : detalleFacturaProvExcellV2[] = [];

  public products = [];
  
  public habilitarColumnas: Boolean = false;
  public listaPaisOrigenProductos: any[] = [];
  public listaMarcasProductos: any[] = [];
  public regexCodProd: RegExp = /^[a-zA-Z]+$|^[0-9]+$|^[a-zA-Z0-9]+$|^[a-zA-Z0-9 \- \_ \. \, \/ ]+$/;

  public fechaActual : Date = new Date();
  public mostrarModalActualizarFechas : boolean = false;
  public nuevaFechaEmision : Date | null = null;
  public nuevaFechaVencimiento : Date | null = null;

  public mostrarModalBuscarProveedor : boolean = false;

  public busquedaProveedorLista : proveedor[] = [];

  public busquedaProveedorSeleccionado : proveedor | null = null;

  public totalCantidadDetallePedido : number = 0;

  constructor(
    private formBuilder: FormBuilder, 
    private spinner: NgxSpinnerService,
    private mantenimientopedidosService: MantenimientoPedidosService,
    private mantenimientoFacturaProvService: ManteniminetoFacturaProveedorService,
    private authStore: Store<AuthState>,
  ) {
    console.log( this.documentoFacturaForm );

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
  
  ngOnInit() {
    this.proveedorForm = this.formBuilder.group({
      codproveedor: ['', [Validators.required, Validators.pattern( this.regexCodProd )]]
    });

    this.documentoFacturaForm = this.formBuilder.group({
      numDocumento: ['', [Validators.required, Validators.pattern( this.regexCodProd )]]
    });

    this.codProveedor?.nativeElement.focus();    

    this.obtenerPaisesOrigen();
    this.obtenerMarcas();    
    this.cantidadDocumentos();
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
    this.buscarNuevoDocumento();

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
  public showSpinner = (opt: boolean, txt: string = 'Loading...') : void => {
    this.txtSpinner = txt;
    ( opt ) ? this.spinner.show() : this.spinner.hide();
  }

  /**
   * @description Metodo utilizado para habilitar la edicion de las columnas de la tabla.
   * @param habilitar 
   */
  public habilitarDeshabilitarColumnas = (habilitar: boolean) : void => {
    this.habilitarColumnas = habilitar;
  }
  
  /**
   * @description Metodo que muestra la cantidad de documentos que posee el proveedor.
   */
  public cantidadDocumentos = () : void => { 
    this.placeholderdocumento = `${ this.proveedor?.facturasprov  ? 'Documentos: ' : 'Sin documentos: ' } ${ this.proveedor?.facturasprov ? this.proveedor?.facturasprov.length : 0  }` 
  }
  
  /**
   * @description Metodo utilizado para convertir a mayuscula los datos ingresados en el numero de documento.
   */
  public convertirMayusculas = () : void => {
    this.documentoFacturaForm?.controls['numDocumento'].setValue( this.documentoFacturaForm?.get('numDocumento')?.value?.toUpperCase() );
  }

  /**
   * @description Funcion que permite determinar el color a mostrar segun el estado de una factura proveedor.
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

  /**
   * @description Metodo utilizado de limpiar los registros obtenidos en la pantalla. y permitir la busqueda de otro documento.
   */
  public buscarNuevoDocumento = () : void => {
    this.proveedorForm?.reset();
    this.documentoFacturaForm?.reset();
    this.proveedor = null;
    this.facturaProveedor = null;
    this.facturaProveedorDetalle = [];
    this.estadosFacturaProv = null;
    this.habilitarColumnas = false;

    this.proveedorForm?.get('codproveedor')?.enable();
    this.documentoFacturaForm?.get('numDocumento')?.enable();
    
    this.codProveedorField.nativeElement.focus();
    this.codProveedorField.nativeElement.select();

    this.totalCantidadDetallePedido = 0;

    this.codProveedor?.nativeElement.focus();
    this.cantidadDocumentos();
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
   * */
  public obtenerPaisesOrigen = async () : Promise<void> => {
    this.mantenimientopedidosService.getPaisOrigenProductos()
    .subscribe(
      ( data : any[] ) => {
        this.listaPaisOrigenProductos = data;
      }
    );
  }
  
  /**
   * @description: Metodo utilizado para obtener los datos del proveedor de una factura proveedor.
   * @returns 
   */
  public obtenerProveedor = async () : Promise<void> => {  
    if (this.proveedorForm?.status == 'INVALID') {
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
        /*
        if ( ! resp?.success ) {
          Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
          this.proveedorForm?.reset();
          this.showSpinner(false, '');
          return;
        }
        */

        this.proveedor = data;

        // ? Se deshabilita el input para que no se edite el dato y pasa el foco a numero de pedido
        this.proveedorForm?.get('codproveedor')?.disable();
        
        this.cantidadDocumentos();
        this.numDocumento?.focus();
        this.showSpinner(false, '');
      }
    );
  }
  
  /**
   * @description: Metodo utilizado para obtener los datos de la factura proveedor mediante su numero de documento.
   * @returns 
   */
  public obtenerDocumentoFactura = async () : Promise<void> => {
    if ( this.proveedorForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Código de proveedor!',text: 'Al parecer no ha ingresado un código de proveedor válido.'});
      return;
    };
    
    if ( this.documentoFacturaForm?.status == 'INVALID' ) {
      await Swal.fire({ icon: 'error',  title: 'Número de Documento!',text: 'Al parecer no ha ingresado un número de documento válido.'});
      return;
    }

    const numeroDocumento = this.documentoFacturaForm?.controls?.['numDocumento']?.value;

    if ( !this.regexCodProd.test(numeroDocumento) ) {
      Swal.fire({ icon: 'error', title: 'Número de Documento!', text: 'Debe ingresar un número de documento válido.' });
      return;
    }

    this.showSpinner(true, 'Buscando datos de Factura Proveedor!');
    
    this.mantenimientoFacturaProvService.getFacturaProveedor(
      this.proveedor?.codigoproveedor || '',
      numeroDocumento
    )
    .subscribe(
      async ( data : facturaProveedor ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.documentoFacturaForm?.reset();
        //   this.showSpinner(false, '');
        //   return;
        // } 
    
        this.facturaProveedor = data;
    
        // ? Se deshabilita el input para que no se edite el dato y se obtiene el detalle del pedido
        this.documentoFacturaForm?.get('numDocumento')?.disable(); 
        this.obtenerEstadosFacturaProveedor();
        this.showSpinner(false, '');
        await this.obtenerDetalleFacturaProveedor();
      }
    );
  }

  /**
   * @description Metodo encargado de obtener los estados de una factura proveedor
   * @returns 
   */
  // async obtenerEstadosFacturaProveedor( factProveedor: facturaProveedor ) {
  public obtenerEstadosFacturaProveedor = async () : Promise<void> => {
    this.showSpinner(true, 'Obteniendo estados de la factura...!');
    
    this.mantenimientoFacturaProvService.getEstadosFacturaProveedor(
      this.facturaProveedor?.codigoproveedor || '',
      this.facturaProveedor?.numerodocumento || '',
      this.facturaProveedor?.facturaproveedorid || 0,
    )
    .subscribe(
      ( data : estadosFactura ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // } 
        
        this.estadosFacturaProv = data;
        this.showSpinner(false, '');
      }
    );
  }
  
  /**
   * @description Metodo utilizado para obtener el detalle de la factura proveedor
   * @returns 
   */
  public obtenerDetalleFacturaProveedor = async () : Promise<void> => {
    this.showSpinner(true, 'Obteniendo detalle de la factura...');
    
    this.mantenimientoFacturaProvService.getDetalleFacturaProveedor(
      this.facturaProveedor?.facturaproveedorid || 0,
      this.facturaProveedor?.codigoproveedor || '',
      this.facturaProveedor?.numerodocumento || ''
    )
    .subscribe(
      ( data : facturaProveedorDetalle[] ) => {
        // if ( ! resp?.success ) {
        //   Swal.fire({ icon: 'warning', title: 'Mensaje', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // } 

        this.totalCantidadDetallePedido = 0;

        data.forEach((el) =>{ 
          this.totalCantidadDetallePedido += el.cantidad;
        });
    
        this.facturaProveedorDetalle = data;
        this.showSpinner(false, '');
      }
    );
  }
  
  /**
   * @description Metodo utilizado para actualiar el estado de la factura proveedor
   * @returns 
   */
  public actualizarEstadoFactura = async () : Promise<void> => {
    const user = this.dataUser.codigoempleado;
    const nextStatus = this.estadosFacturaProv?.proximoestadodesc;
    
    const userConfirm = await Swal.fire({
      title: '¿Desea actualizar el estado de la Factura del Proveedor?',
      text: `El estado de la factura se cambiará a "${nextStatus}", no podrá revertir esta acción!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar!'
    }); 

    if (!userConfirm.isConfirmed) return;

    this.showSpinner( true, 'Actualizando el estado de la factura...!' );
    
    this.mantenimientoFacturaProvService.updateEstadoFacturaProveedor(
      this.facturaProveedor?.facturaproveedorid || 0,
      this.facturaProveedor?.codigoproveedor || '',
      this.facturaProveedor?.numerodocumento || '',
      this.estadosFacturaProv?.proximoestado || '',
      user
    )
    .subscribe(
      ( data : boolean ) => {
        if ( ! data ) {
          Swal.fire({ icon: 'warning', title: 'Mensaje', text: `No se pudo actualizar el registro con los datos proporcionados.` });
          this.showSpinner(false, '');
          return;
        } 
        
        this.showSpinner(false, '');
    
        Swal.fire({icon: 'info', title: 'Mensaje', text: `El estado de la factura se cambió a "${ nextStatus }"`});
        this.obtenerDocumentoFactura();
        this.obtenerEstadosFacturaProveedor();
      }
    );
  }
  
  /**
   * @description Metodo utilizado para volver a cargar el detalles de la factura proveedor
   */
  public recargarDetalleFacturaProveedor = async () : Promise<void> => {
    console.log( 'Volveremos a cargar el detalle de la factura proveedor' );
    this.facturaProveedorDetalle = [];
    this.productosSeleccionados = [];
    this.habilitarColumnas = false;

    await this.obtenerDocumentoFactura();
    this.cantidadDocumentos();
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
      text: "No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }); 

    if (!userConfirm.isConfirmed) return;

    this.showSpinner( true, 'Eliminando productos seleccionados...' );
    
    this.productosSeleccionados?.forEach( async (prod) => {
      this.mantenimientoFacturaProvService.deleteFacturaProveedorDetalle(
        prod.facturaproveedordetalleid,
        prod.facturaproveedorid
      )
      .subscribe(
        ( data : boolean ) => { }
      );
    } );
    
    this.showSpinner( false, '' );
    Swal.fire(  '¡Eliminados!', 'Los productos seleccionados han sido eliminados.', 'success' ).then( ok => {
      this.obtenerDocumentoFactura();
      this.recargarDetalleFacturaProveedor();
      this.cantidadDocumentos();
    } );    
  }

  /**
   * @description Metodo utilizado para actualizar los valores del impuesto, descuento, flete de una factura.
   * @returns 
   */
  public actualizarRegistros = async () : Promise<void> => {
    if ( 
      this.facturaProveedor?.facturaproveedorid == undefined || 
      this.facturaProveedor?.facturaproveedorid == null  ||
      this.facturaProveedor?.facturaproveedorid == 0 || 
      this.facturaProveedor == null
    ) {
      Swal.fire(  '¡Mensaje!', 'No se tiene un registro de factura para actualizar.', 'error' )
      return;
    }

    const userConfirm = await Swal.fire({
      title: '¿Desea actualizar el importe de la factura?',
      text: "No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!'
    }); 

    if (!userConfirm.isConfirmed) return;

    this.showSpinner( true, 'Actualizando importe de la factura...' );

    if ( this.productosSeleccionados.length > 0 ) {
      this.productosSeleccionados.forEach( async (prod) => {
        this.mantenimientoFacturaProvService.updatePrecioCostoDetalleFacProv(
          prod.facturaproveedordetalleid,
          prod.facturaproveedorid,
          prod.codigoproveedor,
          prod.precio,
          prod.costoproducto,
          prod.paisorigenid,
          prod.marca
        )
        .subscribe(
          ( data : boolean ) => { }
        );
      } );
    }
    
    this.mantenimientoFacturaProvService.updateImpuestoDescuentoFleteFacProv(
      this.facturaProveedor.facturaproveedorid,
      this.facturaProveedor.codigoproveedor,
      this.facturaProveedor.impuesto,
      this.facturaProveedor.descuento,
      this.facturaProveedor.flete
    )
    .subscribe(
      ( data : boolean ) => {
        if ( ! data ) {
          Swal.fire({ icon: 'warning', title: 'Mensaje', text: `No se pudo actualizar el registro con los datos proporcionados.` });
          this.showSpinner(false, '');
          return;
        } 
        
        this.showSpinner(false, '');
    
        Swal.fire({icon: 'info', title: 'Mensaje', text: `El importe de la factura fue actualizado correctamente!`}).then( () => {
          console.log('Obtener datos de la factura.....');
          
          this.obtenerDocumentoFactura();
          this.recargarDetalleFacturaProveedor();
          this.cantidadDocumentos();
        });
      }
    );
  }
  
   // *  Exportar Grid a Excel
  /**
   * @description: Metodo utilizado para exportar el detalle de la factura proveedor a un excel.
   * @returns 
   */
  public exportarDetalleFacturaProveedor = async () : Promise<void> => {
    this.showSpinner(true, 'Obteniendo datos para exportar!');
    
    this.mantenimientoFacturaProvService.getExportarDetalleFacturaProveedor( 
      this.facturaProveedor?.codigoproveedor || '',
      this.facturaProveedor?.numerodocumento || ''
    )
    .subscribe(
      ( data : detalleFacturaProvExcellV2[] ) => {
        // if ( ! resp?.success ) {
        //   console.log('Ocurrio error al obtener los datos.');
        //   Swal.fire({ icon: 'error', title: 'Error', text: `${ resp?.message }` });
        //   this.showSpinner(false, '');
        //   return;
        // }
    
        if ( data.length === 0 ) { 
          console.log('No se obtuvieron datos para exportar');
          Swal.fire({ icon: 'warning', title: 'Mensaje', text: 'No se obtuvieron datos para exportar'});
          this.showSpinner(false, '');
          return;
        }
    
        this.excellDetalleFacturaProv = data;
        this.showSpinner(false, '');
        this.exportExcel();
      }
    );
  }
  
  /**
   * @description: Metodo encargado de exportar el detalle de la factura a un formato excell.
   */
  public exportExcel = () : void => {
    const worksheet = xlsx.utils.json_to_sheet(this.excellDetalleFacturaProv);
    const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, `Detalle de Factura ${ this.facturaProveedor?.numerodocumento } Proveedor ${ this.proveedor?.codigoproveedor } `);
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
   * @description: Metodo para mostrar el modal para el ingreso de las mismas
   */
  public abrirModalActualizarFechasEmisionVencimiento = () : void => {
    if( this.facturaProveedor ) {
      this.mostrarModalActualizarFechas = true;

      if( this.facturaProveedor.fechaemision ) {
        this.nuevaFechaEmision = new Date(this.facturaProveedor.fechaemision);
      }
      else {
        this.nuevaFechaEmision = null;
      }
      
      if( this.facturaProveedor.fechavencimiento ) {
        this.nuevaFechaVencimiento = new Date(this.facturaProveedor.fechavencimiento);
      }
      else {
        this.nuevaFechaVencimiento = null;
      }
    }
  }

  /**
   * @description: Metodo para esconder el modal del ingreso de las mismas
   */
  public cerrarModalActualizarFechasEmisionVencimiento = () : void => {
    this.mostrarModalActualizarFechas = false;

    this.nuevaFechaEmision = null;
    this.nuevaFechaVencimiento = null;
  }

  /**
   * @description: Metodo para guardar las nuevas fechas de emision y vencimiento
   */
  public actualizarFechaEmisionVencimiento = async () : Promise<void> => {
    this.mostrarModalActualizarFechas = false;

    if( ! this.facturaProveedor ) {
      return ;
    }

    if( ! this.nuevaFechaEmision ) {
      Swal.fire({ icon: 'warning', title: 'Mensaje', text: `No se pudo actualizar el registro con los datos proporcionados.` });

      this.cerrarModalActualizarFechasEmisionVencimiento();

      return ;
    }

    this.showSpinner(true, 'Actualizando fechas');

    this.mantenimientoFacturaProvService.actualizarFechaEmisionVencimiento(
      this.facturaProveedor.numerodocumento,
      this.facturaProveedor.codigoproveedor,
      this.nuevaFechaEmision,
      this.nuevaFechaVencimiento
    )
    .subscribe(
      ( data : boolean ) => {
        this.showSpinner(false, '');

        if( data ) {
          Swal.fire({ icon: 'success', title: 'Fechas actualizadas' });
        }
      }
    );

    this.cerrarModalActualizarFechasEmisionVencimiento();
  }
  //#endregion // * METODOS
}