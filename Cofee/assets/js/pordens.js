var vueOrden= new Vue({
    el: "#AdminOrden",
    data:{
         alerta:{
          titulo: "Error",
          mensaje:"Texto"
      },
        ordenes:[],
        productos:[],
        categorias:[],
        detalleOrden:[],
        productoSeleccionado: [],
        ordenSel:0,
        orderByCampo:"",
        orderByAsc:1,
        textoBusqueda:"",
        estadoSelected:"A",
        ordenSelected:0,
        categoriaSelected:1,
        productoSelected:1,
        ordenSelec:0,
        preOrden:0,
        nuevaOrden: {
            "idOrden": 0,
            "fecha":new Date(),
            "mesero": "",
            "mesa": "",
            "cliente": "",
            "estado": "A",
            "total": 0,
            "observacion": ""
        }, 
        nuevoDetalle: {
            "idOrden": 0,
            "idProducto": 0,
            "cantidad": 0,
            "precioUnitario": 0,
        }, 

        
    },
    
     methods:{
            mostrarAlerta:function(titu,msg){
            this.alerta.titulo=titu;
            this.alerta.mensaje=msg;
           
            $("#miAlerta").show('fade');
            setTimeout(function(){
                $("#miAlerta").hide('fade');
            },5000);
            
        },
        cerrarAlerta:function(){
            $('#miAlerta').hide('fade');
        },
                

        buscar:function(x){
            
            if(this.textoBusqueda=="")
                return true;
            var cad=this.ordenes[x].idOrden + 
                this.ordenes[x].fecha +
                this.ordenes[x].cliente+
                this.ordenes[x].mesa+
                this.ordenes[x].mesero+
                this.ordenes[x].estado+
                this.ordenes[x].total;        
            
            cad=cad.toUpperCase();
            
            if(cad.indexOf(this.textoBusqueda.toUpperCase())>=0)
                        return true;
            else
                return false;
            
                
            
        },
        //METODO MOSTRAR NOMBRE DEL PRODUCTO MEDIANTE ID
        nombreProducto:function(idPro){
            return this.productos.find(function(pro){
                return pro.idProducto==idPro
            }).nombreProducto;
        },
        cargarDatos: function(){
            //cargando las ordenes
            axios.get('http://localhost:3000/api/Ordens')
                .then(function (res) {
                    vueOrden.ordenes=res.data;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
            //cargando DetalleOrden
            axios.get('http://localhost:3000/api/DetalleOrdens')
                .then(function (res) {
                    vueOrden.detalleOrden=res.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
                        //PRODUCTOS
            axios.get('http://localhost:3000/api/Productos')
                .then(function (res) {
                    vueOrden.productos=res.data;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
            //cargando las categorias
            axios.get('http://localhost:3000/api/Categoria')
                .then(function (res) {
                    vueOrden.categorias=res.data;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
            
            
        },
        agregarOrden:function(){
            
            axios.post('http://localhost:3000/api/Ordens',this.nuevaOrden)
                .then(function (res) {
                    vueOrden.nuevaOrden.fecha="";
                    vueOrden.nuevaOrden.mesero="";
                    vueOrden.nuevaOrden.mesa="";
                    vueOrden.nuevaOrden.cliente="";
                    vueOrden.nuevaOrden.estado="A";
                    vueOrden.nuevaOrden.total=0;
                    vueOrden.nuevaOrden.observacion="";

                    vueOrden.cargarDatos();
                })
                .catch(function (error) {
                    console.log(error);
                });
         $('#modalAgregarProd').modal('show');
         preOrden=vueOrden.ordenes.length;
         ordenSelected=vueOrden.ordenes[preOrden].idOrden;
          console.log(ordenSelected);
        
        },
         
         
            mostrarDetalle2:function(){
            $('#modalDetalle').on('show', function(e) {    
            var ordenSelected = $(e.relatedTarget).data().ordenSelected;
            $(e.currentTarget).find('#idOrdenText').val(ordenSelected);
  });
            },
            mostrarAgregar:function(){
            $('#modalAgregar').modal('show');
            },
            mostrarAgregarProd:function(){
            $('#modalAgregarProd').modal('show');
            },
            mostrarAgregarDetalle:function(){
                console.log(vueOrden.ordenes[preOrden]);
                ordenSelected=vueOrden.ordenes[preOrden].idOrden;
                console.log(ordenSelected);
                
            $('#modalAgregarDetalle').modal('show');


            },
            mostrarCobrar:function(){
            $('#modalCobrar').modal('show');   
            },
            mostrarEliminar:function(){
             $('#modalEliminar').modal('show');
            },
            mostrarDetalle:function(){
             $('#modalDetalle').modal('show');
            },
            mostrarCantidadDetalle:function(){
             $('#modalCantidadProducto').modal('show');
            },
            orderBy: function(campo){
                this.orderByCampo=campo;

              if(campo=="ID"){
                 this.ordenes.sort(function(a,b){
                    // Se debe usar vueProduct.orderByAsc
                    // porque this ya no hace referencia al objeto vue


                     return b.idOrden - a.idOrden;
                  });

              }
            if(campo='CLIENTE'){
                this.ordenes.sort(function(a,b){
                    if(a.cliente>b.cliente)
                        return vueOrden.orderByAsc * 1;
                    else
                        return vueOrden.orderByAsc * -1;
                });

            }
            if(campo=="MESA"){
                 this.ordenes.sort(function(a,b){
                    // Se debe usar vueProduct.orderByAsc
                    // porque this ya no hace referencia al objeto vue
                     return vueOrden.orderByAsc * (a.mesa - b.mesa);
                  });

              }  
            if(campo=="MESERO"){
                 this.ordenes.sort(function(a,b){
                    // Se debe usar vueProduct.orderByAsc
                    // porque this ya no hace referencia al objeto vue
                     return vueOrden.orderByAsc * (a.mesero - b.mesero);
                  });

              } 
            },
               
                 //METODO DE COBRAR
        cobro:function(){
         

        var efectivo =parseFloat(document.getElementById("txtEfectivo").value);
        var total = parseFloat(document.getElementById("txtHola").value);
        
        
        if(efectivo>total){
            
            this.ordenes[this.ordenSel].estado="C";
            $('#modalCobrar').modal('hide');
            axios.put('http://localhost:3000/api/Ordens',this.ordenes[this.ordenSel])
                   .then(function (res) {                    
                        console.log("UPDATED ORDEN");
                        vueOrden.mostrarAlerta("OrdenCobrada","Se cobro la orden satisfactoriamente");
                    })
                    .catch(function (error) {
                        vueOrden.mostrarAlerta("Error",error);
                        console.log(error);
                    });


            var cambio=efectivo-total;

            document.getElementById('labelPrueba').innerText = efectivo;
            document.getElementById('labelCambio').innerText = cambio.toFixed(2);
            document.getElementById('txtEfectivo').value = '';



            $('#alertaPago').show('fade');
            // ocultando la alerta luego de 5 segundos
            setTimeout(function(){
            $('#alertaPago').hide('fade');
            },5000);

           $('#linkCloseAlert').click(function(){
            $('#alertaPago').hide('fade');
            });

            document.getElementById('txtPrueba').value = '';
                
        }
        else{
             $('#alertaCobro').show('fade');
            // ocultando la alerta luego de 5 segundos
            setTimeout(function(){
            $('#alertaCobro').hide('fade');
            },5000);

           $('#linkCloseAlert1').click(function(){
            $('#alertaCobro').hide('fade');
            });

        }
        
            
    },
        //METODO ELIMINAR ORDEN CANCELADA

                //METODO ELIMINAR ORDEN
        eliminarOrden:function(){
            console.log();
            axios.delete('http://localhost:3000/api/DetalleOrdens/'+ this.ordenes[this.ordenSel].idOrden)
                .then(function (res) {
                     vueOrden.cargarDatos();
                    })
                .catch(function (error) {
                     console.log(error);
                });
            axios.delete('http://localhost:3000/api/Ordens/'+ this.ordenes[this.ordenSel].idOrden)
            .then(function (res) {
                    console.log("DELETE ORDEN");  
                    vueOrden.cargarDatos();
                    vueOrden.mostrarAlerta("Orden Eliminada","La orden se eliminó de la base de datos");

                })
                .catch(function (error) {
                    vueOrden.mostrarAlerta("Error:",error);
                    console.log(error);
                });
           
        },
         //METODO AGREGAR PRODUCTO EN DETALLE ORDEN **PRUEBA**
        agregarDetalle:function(){

            axios.patch('http://localhost:3000/api/DetalleOrdens',this.nuevoDetalle)
                .then(function (res) {
                    vueOrden.nuevoDetalle.idOrden=0;
                    vueOrden.nuevoDetalle.idProducto=0;
                    vueOrden.nuevoDetalle.precioUnitario=0;
                    vueOrden.nuevoDetalle.cantidad=0;
                    vueOrden.cargarDatos();
                    vueOrden.mostrarAlerta("Producto Agregado", "Se agregó el nuevo producto");
                })
                .catch(function (error) {
                    vueOrden.mostrarAlerta("Error", error);
                    console.log(error);
                });
        },
         
        // GUARDA LOS PRODUCTOS SELECCIONADOS (PARA MOSTRARLOS EN RESUMEN)



     },
    mounted:function(){
        this.cargarDatos();
    },
});