var vueCategori= new Vue({
    el: "#AdminCate",
    data:{
         alerta:{
         titulo: "Error",
         mensaje:"Texto"
      },
         categorias:[],
         textoBusqueda:"",
         categoriaSelected: 0,
         nuevaCategoria: {
            "idCategoria": 0,
            "nombreCategoria": "",
            }, 
               
      },
    methods:{

        
            agregarCategoria:function(){
            axios.post('http://localhost:3000/api/Categoria',this.nuevaCategoria)
                .then(function (res) {
                    vueCategori.nuevaCategoria.nombreCategoria="";
                    vueCategori.nuevoProducto.precio=0;
                    vueCategori.cargarDatos();
                    vueCategori.mostrarAlerta("Categoria Agregada","Se agregó la nuevo producto");
                })
                .catch(function (error) {
                    // handle error
                    vueProduct.mostrarAlerta("Error",error);

                    console.log(error);
                });
        },
            buscar:function(x){
            
            if(this.textoBusqueda=="")
                return true;
                    
            var cad=this.categorias[x].nombreCategoria + 
                this.categorias[x].idCategoria;
            cad=cad.toUpperCase();
            
            if(cad.indexOf(this.textoBusqueda.toUpperCase())>=0)
                        return true;
            else
                return false;
            
                
            
        },
        
            modificarCategoria:function(){
            axios.put('http://localhost:3000/api/Categoria',this.categorias[this.categoriaSelected])
                .then(function (res) {
                    console.log("UPDATED CATEGORIA");
                    vueCategori.mostrarAlerta("categoria Modificada","Se modifico la categoria satisfactoriamente");

                })
                .catch(function (error) {
                    // handle error
                    vueCategori.mostrarAlerta("Error",error);

                    console.log(error);
                });
        },
            eliminarCategoria:function(){
            console.log();
            axios.delete('http://localhost:3000/api/Categoria/'+ this.categorias[this.categoriaSelected].idCategoria)
                .then(function (res) {
                    console.log("DELETE CATEGORIA");  
                    vueCategori.cargarDatos();
                    vueCategori.mostrarAlerta("Categoria Eliminada","La Categoria se eliminó de la base de datos");

                })
                .catch(function (error) {
                    // handle error
                    vueCategori.mostrarAlerta("Error:",error);

                    console.log(error);
                });
        },
       
            mostrarAgregar:function(){
            $('#modalAgregar').modal('show');
            },
            mostrarModificar:function(){
            $('#modalModificar').modal('show');
        },
            mostrarEliminar:function(){
            $('#modalEliminar').modal('show');
        },
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
        
          cargarDatos: function(){
            //cargando las categorias
            axios.get('http://localhost:3000/api/Categoria')
                .then(function (res) {
                    vueCategori.categorias=res.data;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
         
        },
        
    },
    
    mounted:function(){
        this.cargarDatos();
    },
    
})