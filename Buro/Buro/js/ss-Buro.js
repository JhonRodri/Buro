var app = angular.module('miApp', ['ngStorage']);

app.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.controller('Login', function ($scope, $window, $localStorage) {
    $scope.Usuario = {
        Codigo: null
    }
    $window.sessionStorage.removeItem('conectado');
    localStorage.clear();
    $scope.Entrar = function () {

        if ($scope.Usuario.Codigo === "envia1998003") {
            $window.sessionStorage["conectado"] = "1";
            //$window.location.assign("Home/Inicio"); //Pruebas
            $window.location.assign("/BuroPruebas/Home/Inicio")
            //$window.location.assign("/Buro/Home/Inicio"); // Produccion
        }
        else {
            alert("Codigo Invalido");
        }
    };
})

app.controller('Inicio', function ($scope, $rootScope, $http, $window, $localStorage) {

    if ($window.sessionStorage.getItem('conectado') != "1") {
        $window.location.assign("../");
    }

    $scope.liquidacion = {
        datos: [{
            cod_CiudadOrigen: null,
            cod_CiudadDestino: null,
            peso: null,
            alto: null,
            largo: null,
            ancho: null,
            val_declarado: null,
            Contiene: null,
            volumen: null,
            servicio: null,
            flete: null,
            flete_variable: null,
            total: null
        }]
    };

    $scope.Registro = {

        cubrimientoOrigen: null,
        cubrimiento: null,
        cubrimientoD: null,
        Cod_CiudadOrigen: null,
        Cod_CiudadDestino: null,
        peso: null,
        ancho: null,
        alto: null,
        largo: null,
        valor_Declarado: null,
        Que_Contiene: null,
        unidades: 1,
        ocultar: true,
        popUp: true,
        liquidacion: null,
        espera: true,
        flete: null,
        total: null,
        flete_variable: null,
        mensaje : null

   
        /*Direcciones: [{
            Cod_Ciudad: null,
            Dir: null,
            Descripcion: null
        }]*/
    }

    /*$http.get("https://portal.envia.co/ServicioRestRegistroCliente/service1.svc/ConsultaRegistroDireccionesEyG/939393@envia.co").then(
            function (res) {
                $scope.lista = res.data[0].listado;

                $scope.fecha = res.data[0].listado[0].fec_inscripcion.substring(0, 10)
                alert($scope.fecha);
            },

            function (err) {
                $scope.puntos = err.data;
            }
        );*/


    $http.get("https://portal.envia.co/ServicioLiquidacionRest/Service1.svc/Ciudad/Regional/").then(
            function (res) {
                $scope.Registro.cubrimientoOrigen = res.data[0].listado

            },

            function (err) {
                $scope.puntos = err.data;
            }
        );

    var data = {
        "cod_regional": 1,
        "cod_servicio": 3
    }

    $http.post("https://portal.envia.co/ServicioLiquidacionRest/Service1.svc/Ciudad/Servicio/", data).then(
      function successCallback(response) {
          $scope.Registro.cubrimiento = response.data[0].listado
      },
      function errorCallback(response) {
          console.log(response);
          alert("Error cargando las ciudades");
      }
    );

    $scope.Validar = function () {

        if ($scope.Registro.Cod_CiudadOrigen === null || $scope.Registro.Cod_CiudadDestino === null || $scope.Registro.peso === null || $scope.Registro.ancho === null || $scope.Registro.alto === null || $scope.Registro.largo === null || $scope.Registro.valor_declarado === null
            || $scope.Registro.Cod_CiudadOrigen == "" || $scope.Registro.Cod_CiudadDestino == "" || $scope.Registro.peso == "" || $scope.Registro.ancho == "" || $scope.Registro.alto == "" || $scope.Registro.largo == "" || $scope.Registro.valor_declarado == "")
        {
            $scope.Registro.mensaje = "Por favor valida que todos los campos se encuentren diligenciados.";
            $scope.Registro.popUp = false;
            $scope.Registro.ocultar = true;
            return; 
        }

        if ($scope.Registro.peso > 8) {
            $scope.volumen = (($scope.Registro.ancho / 100) * ($scope.Registro.alto / 100) * ($scope.Registro.largo / 100)) * 400;
        } else {
            $scope.volumen = (($scope.Registro.ancho / 100) * ($scope.Registro.alto / 100) * ($scope.Registro.largo / 100)) * 222;
        }
        

        $scope.volumenTotal = 0;
        $scope.servicio = 12;

        if ($scope.volumen > 8 && $scope.volumen < 8.5) {
            $scope.volumenTotal = 8;
        } else {
            $scope.volumenTotal = Math.ceil($scope.volumen);
        }

       
        if ($scope.Registro.peso > 8) {
            $scope.servicio = 3;
        } else {
            $scope.servicio = 12;
        }

        var ciudadOrigen = $scope.Registro.Cod_CiudadOrigen.split(" - ")

        $scope.CiudadOrigenCod = ciudadOrigen[2];


        var ciudadDestino = $scope.Registro.Cod_CiudadDestino.split(" - ")

        $scope.CiudadDestinoCod = ciudadDestino[2];


        var data1 = {
            "ciudad_origen": $scope.CiudadOrigenCod,
            "ciudad_destino": $scope.CiudadDestinoCod,
            "cod_formapago": 6,
            "cod_servicio": $scope.servicio,
            "mca_nosabado": 0,
            "mca_docinternacional": 0,
            "cod_regional_cta": 1,
            "cod_oficina_cta": 1,
            "cod_cuenta": 14315,
            "con_cartaporte": "0",
            "numero_guia": "",
            "num_unidades": $scope.Registro.unidades,
            "mpesoreal_k": $scope.Registro.peso,
            "mpesovolumen_k": $scope.volumenTotal,
            "valor_declarado": $scope.Registro.valor_Declarado
        }

        $scope.Registro.espera = false;
        $scope.Registro.ocultar = true;
        $http.post("https://portal.envia.co/ServicioLiquidacionREST/Service1.svc/Liquidacion/", data1).then(
          function successCallback(response) {
              $scope.Registro.ocultar = false;

              $scope.Registro.liquidacion = response.data
              $scope.flete = $scope.Registro.liquidacion.valor_flete;
              $scope.flete_variable = $scope.Registro.liquidacion.valor_costom;
              $scope.total = $scope.Registro.liquidacion.valor_flete + $scope.Registro.liquidacion.valor_costom;
              $scope.Registro.total = $scope.total;
              $scope.Registro.espera = true;
          },
          function errorCallback(response) {
              $scope.Registro.popUp = true;
              $scope.Registro.ocultar = true;
              $scope.Registro.espera = true;
              alert(response.data.respuesta);
          }
        );
    };

    $scope.LlenarCiudadDestino = function () {

        var ciudadOrigen = $scope.Registro.Cod_CiudadOrigen.split(" - ")

        $scope.CiudadOrigenCod = ciudadOrigen[2];
        $scope.RegionalOrigenCod = ciudadOrigen[3];

        var data2 = {
            "cod_regional": $scope.CiudadOrigenCod,
            "cod_servicio": 3,
            "cod_cubrimiento": "1,4"
        }

        $http.post("http://portal.envia.co/ServicioLiquidacionRest/Service1.svc/Ciudad/Servicio/Cubrimiento", data2).then(
          function successCallback(response) {
              $scope.Registro.cubrimientoD = response.data[0].listado
          },
          function errorCallback(response) {
              console.log(response);
              alert("Error cargando las ciudades");
          }
        );
    };

    $scope.CerrarPopUp = function () {
        $scope.Registro.popUp = true;
    };

    $scope.HacerEnvio = function () {

        var ap = $scope.liquidacion.datos;
        ap.push(ap[1]);
        ap[0] = {
           cod_CiudadOrigen : $scope.Registro.Cod_CiudadOrigen,
           cod_CiudadDestino : $scope.Registro.Cod_CiudadDestino,
           peso : $scope.Registro.peso,
           alto : $scope.Registro.alto,
           largo : $scope.Registro.largo,
           ancho : $scope.Registro.ancho,
           val_declarado : $scope.Registro.valor_Declarado,
           Contiene: $scope.Registro.Que_Contiene,
           volumen: $scope.volumenTotal,
           servicio : $scope.servicio,
           flete : $scope.flete,
           flete_variable: $scope.flete_variable,
           total: $scope.total
        };

        
        
        $localStorage.datos = $scope.liquidacion.datos;
        $window.location.assign("Envio");
    };

})

app.controller('Envio', function ($scope, $http, $window, $localStorage) {

    if ($window.sessionStorage.getItem('conectado') != "1") {
        $window.location.assign("../");
    }

    
    $scope.liquidacion = {
        datos: [{
            cod_CiudadOrigen: null,
            cod_CiudadDestino: null,
            peso: null,
            alto: null,
            largo: null,
            ancho: null,
            val_declarado: null,
            Contiene: null,
            volumen: null,
            servicio: null,
            flete: null,
            flete_variable: null,
            total: null,


        }]
    };

    
    $scope.liquidacion.datos = $localStorage.datos;

    $scope.flete = $scope.liquidacion.datos[0].flete;
    $scope.flete_variable = $scope.liquidacion.datos[0].flete_variable;
    $scope.total = $scope.liquidacion.datos[0].total;

    $scope.Registro = {
        num_cajas: 1,
        nombre_Origen: null,
        apellido_Origen: null,
        celular_Origen: null,
        cod_ciudadOrigen: $scope.liquidacion.datos[0].cod_CiudadOrigen,
        cod_ciudadDestino: $scope.liquidacion.datos[0].cod_CiudadDestino,
        direccion_Origen: null,
        descripcion_Origen: null,
        correo_Origen: null,
        nombre_Destino: null,
        apellido_Destino: null,
        celular_Destino: null,
        direccion_Destino: null,
        descripcion_Destino: null,
        cubrimientoOrigen: null,
        cubrimiento: null,
        popUp: true,
        espera: true,
    }

    $http.get("https://portal.envia.co/ServicioLiquidacionRest/Service1.svc/Ciudad/Regional/").then(
            function (res) {
                $scope.Registro.cubrimientoOrigen = res.data[0].listado

            },

            function (err) {
                $scope.puntos = err.data;
            }
        );

    var data = {
        "cod_regional": 1,
        "cod_servicio": 3
    }

    $http.post("https://portal.envia.co/ServicioLiquidacionRest/Service1.svc/Ciudad/Servicio/", data).then(
      function successCallback(response) {
          $scope.Registro.cubrimiento = response.data[0].listado

          $scope.Registro.cod_ciudadOrigen= $scope.liquidacion.datos[0].cod_CiudadOrigen;
          $scope.Registro.cod_ciudadDestino = $scope.liquidacion.datos[0].cod_CiudadDestino;
      },
      function errorCallback(response) {
          console.log(response);
          alert("Error cargando las ciudades");
      }
    );

  
    $scope.Calcular = function () {
        $scope.flete = $scope.Registro.num_cajas * $scope.liquidacion.datos[0].flete;
        $scope.flete_variable = $scope.Registro.num_cajas * $scope.liquidacion.datos[0].flete_variable;
        $scope.total = $scope.Registro.num_cajas * $scope.liquidacion.datos[0].total;

    };

    $scope.ConfirmarEnvio = function () {
        if ($scope.Registro.nombre_Origen === null || $scope.Registro.apellido_Origen === null || $scope.Registro.celular_Origen === null || $scope.Registro.direccion_Origen === null || $scope.Registro.correo_Origen === null ||
            $scope.Registro.nombre_Destino === null || $scope.Registro.apellido_Destino === null || $scope.Registro.celular_Destino === null || $scope.Registro.direccion_Destino === null ||
            $scope.Registro.nombre_Origen == "" || $scope.Registro.apellido_Origen == "" || $scope.Registro.celular_Origen == "" || $scope.Registro.direccion_Origen == "" || $scope.Registro.correo_Origen == "" ||
            $scope.Registro.nombre_Destino == "" || $scope.Registro.apellido_Destino == "" || $scope.Registro.celular_Destino == "" || $scope.Registro.direccion_Destino == "") {

            $scope.Registro.popUp = false;
            return;
        }

        //------------------------------------------------- 

        var ciudadOrigen = $scope.liquidacion.datos[0].cod_CiudadOrigen.split(" - ");
        $scope.CiudadOrigenCod = ciudadOrigen[2];

        var ciudadDestino = $scope.liquidacion.datos[0].cod_CiudadDestino.split(" - ");
        $scope.CiudadDestinoCod = ciudadDestino[2];

        $scope.complementoOrigen = null;
        $scope.complementoDestino = null;

        if ($scope.Registro.descripcion_Origen === null) {
            $scope.complementoOrigen = "";
        } else {
            $scope.complementoOrigen = $scope.Registro.descripcion_Origen;
        }

        if ($scope.Registro.descripcion_Destino === null) {
            $scope.complementoDestino = "";
        } else {
            $scope.complementoDestino = $scope.Registro.descripcion_Destino;
        }


        var data5 = {
            "ciudad_origen": $scope.CiudadOrigenCod,
            "ciudad_destino": $scope.CiudadDestinoCod,
            "cod_formapago": 6,
            "cod_servicio": $scope.liquidacion.datos[0].servicio,
            "mca_nosabado": 0,
            "mca_docinternacional": 0,
            "cod_regional_cta": 1,
            "cod_oficina_cta": 1,
            "cod_cuenta": 14315,
            "con_cartaporte": "0",
            "numero_guia": "",
            "num_unidades": $scope.Registro.num_cajas,
            "mpesoreal_k": $scope.liquidacion.datos[0].peso,
            "mpesovolumen_k": $scope.liquidacion.datos[0].volumen,
            "valor_declarado": $scope.liquidacion.datos[0].val_declarado,
            "info_origen": {
                "nom_remitente": $scope.Registro.nombre_Origen + " " + $scope.Registro.apellido_Origen,
                "dir_remitente": $scope.Registro.direccion_Origen + " " + $scope.complementoOrigen,
                "tel_remitente": $scope.Registro.celular_Origen,
                "ced_remitente": ""
            },
            "info_destino": {
                "nom_destinatario": $scope.Registro.nombre_Destino + " " + $scope.Registro.apellido_Destino,
                "dir_destinatario": $scope.Registro.direccion_Destino + " " + $scope.complementoDestino,
                "tel_destinatario": $scope.Registro.celular_Destino,
                "ced_destinatario": ""
            },
            "info_contenido": {
                "dice_contener": $scope.liquidacion.datos[0].Contiene,
                "texto_guia": "",
                "accion_notaguia": "",
                "num_documentos": "",
                "centrocosto": "",
                "valorproducto": "0"
            },
            "el_usr": "48B8CAST",
            "el_psw": "48B8CD82"
        }


        $scope.guias = {
            numeros: [{
                guia: null,
                urlguia: null,
                urlrotulo: null
            }]
        };

        var ap1 = $scope.guias.numeros;

        for (var i = 0; i < $scope.Registro.num_cajas; i++) {

                $http.post("https://portal.envia.co/servicioliquidacionrest/Service1.svc/Generacion2/", data5).then(
                  function successCallback(response) {

                      $scope.guias.numeros.push({
                          guia: response.data.guia,
                          urlguia: response.data.urlguia,
                          urlrotulo: response.data.urlguia.replace("Guia3.aspx", "ISTICKER_ZEA2.aspx")
                      });


                      if ($scope.Registro.num_cajas == $scope.guias.numeros.length -  1)
                      {
                          $localStorage.correo = $scope.Registro.correo_Origen;
                          $localStorage.guias = $scope.guias.numeros;
                          $window.location.assign("Confirmacion");

                      }
                  },
                  function errorCallback(response) {
                      console.log(response);
                      alert("Error cargando las guías");
                  }
 
                );
        }


        

        console.log($scope.guias.numeros);

       
        //------------------------------------------------
    };

    $scope.CerrarPopUp = function () {
        $scope.Registro.popUp = true;
    };
})

app.controller('Confirmacion', function ($scope, $http, $window, $localStorage) {

    $scope.guias = {
        numeros: [{
            guia: null,
            urlguia: null,
            urlrotulo: null
        }]
    };

    $scope.guias.numeros = $localStorage.guias;
    $scope.correo_origen = $localStorage.correo;

    /*$scope.mensaje = "<html><head></head><body><p>A continuación encontrara las guías y sus respectivos rotulos. </p><br /><table>";

    for (var i = 1; i < $scope.guias.numeros.length ; i++)
    {
        $scope.mensaje = $scope.mensaje + "<tr><td>" + $scope.guias.numeros[i].urlguia + "</td><td>" + $scope.guias.numeros[i].urlrotulo + "</td></tr>";
    }

    $scope.mensaje = $scope.mensaje + "</table><body></html>";*/

    $scope.mensaje = "<!DOCTYPE html><html lang='es'><head>  <meta charset='UTF-8'><meta name='viewport' content='width=1, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='ie=edge'> ";
    $scope.mensaje = $scope.mensaje + "<title>Mail</title><style TYPE='text/css' MEDIA=screen>@import url('https://fonts.googleapis.com/css?family=Asap:400,400i,500,500i,600,600i,700,700i'); ";
    $scope.mensaje = $scope.mensaje + "body{font-family: 'asap'; background: #F6F6F6; } :root{ --rojo: #d4001b; --rojo2: #b70017; --gris-2: #525153; --gris: #454F63; --gris2: #606060; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail{ width: 600px; margin: 0 auto; margin-top: 3em; background: white; border-radius: 10px; padding: 5px 20px; -webkit-box-shadow: inset 0px 230px 0px -200px var(--rojo); -moz-box-shadow: inset 0px 230px 0px -200px var(--rojo); box-shadow: inset 0px 230px 0px -200px var(--rojo); } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .red-top{ width: 100%; background: var(--rojo); height: 25px; border-radius: 10px 10px 0px 0px; } .container-mail .top-header{ margin-top: 5em; margin-bottom: 3em; text-align: center; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .nom-user{text-align: center; margin-bottom: 3em; } .container-mail .nom-user h3, h2{ margin-bottom: 0px; color: var(--gris); margin-top: 0px; } .container-mail .nom-user p{ margin-bottom: 0px; color: var(--gris); margin-top: 0px; padding: 0 2em; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .nom-user h3{ color: var(--rojo); font-weight: 500; font-style: italic; font-size: 25px; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .tabla{ margin-bottom: 3em; text-align: center; } .container-mail .tabla .mit{ width: 80%; display: inline-block; text-align: left; padding: 10px; } .container-mail .tabla .root{border-bottom: solid 1px var(--gris); } .container-mail .tabla .mit img{ width: 30px; } .container-mail .tabla .mit .cont-pdf{ float: right; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .tabla .img-pd{ width: 50px float: right } .container-mail .tabla h3{ background: var(--rojo); color: white; width: 200px; border-radius: 10px; } .container-mail .tabla h3 span{ color: white; } .container-mail .tabla h4{ color: var(--gris); font-weight: bold; font-size: 18px; margin-top: 0px; margin-bottom: 0px; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .tabla span{color: var(--gris); font-weight: 200; } .container-mail .funciona{ text-align: center; } .container-mail .accion{ text-align: center; } .container-mail .bott{ text-align: center; margin: 2em 0em; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .bott .boton-mail{ display: inline-block; background: #d4001b; padding: 10px; color: white; font-size: 18px; font-weight: 500; position: relative; border: none; text-decoration: none; -webkit-border-radius: 6px; -moz-border-radius: 6px; -ms-border-radius: 6px; border-radius: 6px; box-shadow: 0 5px #880019; -webkit-box-shadow: 0 5px #880019; -moz-box-shadow: 0 5px #880019; cursor: pointer; } ";
    $scope.mensaje = $scope.mensaje + ".container-mail .bott .boton-mail:hover{ color: white; text-decoration: none; box-shadow: 0 3px #880019; -webkit-box-shadow: 0 3px #880019; -moz-box-shadow: 0 3px #880019; top: 2px; } .container-mail .log-envia{ text-align: center; margin: 2em 0em; } </style></head>";
    $scope.mensaje = $scope.mensaje + "<body><div class='container-mail'><div class='top-header'><img src='http://200.69.100.66/Buro/img/logo-menu.png' alt=''></div><div class='nom-user'><h3>¡Hola!</h3><p>Adjuntamos la Guía y el rótulo de tu envío por favor imprimelas y ten lista la unidad rotulada para entregar a nuestro colaborador envía. </p><p></p></div><div class='tabla'>";

    for (var i = 1; i < $scope.guias.numeros.length ; i++) {
        $scope.mensaje = $scope.mensaje + "<div class='mit'><h4>Guía <span>" + $scope.guias.numeros[i].guia + "</span><a class='cont-pdf' href='" + $scope.guias.numeros[i].urlguia + "'><img class='img-pdf' src='http://200.69.100.66/Buro/img/descarga.png' alt=''></a></h4></div><div class='mit root'><h4>Rótulo<a class='cont-pdf' href='" + $scope.guias.numeros[i].urlrotulo + "'><img class='img-pdf' src='http://200.69.100.66/Buro/img/descarga.png' alt=''> </a></h4></div></div>";
    }

    $scope.mensaje = $scope.mensaje + "</div></body></html>";

    var data6 = {
        "email": $scope.correo_origen,
        "asunto":"Impresión Guías BURO",
        "mensaje": $scope.mensaje
    } 

    
    $http.post("https://portal.envia.co/ServicioRestRegistroCliente/Service1.svc/envioEMail/", data6).then(
              function successCallback(response) {

                  alert("Correo enviado");
               
              },
              function errorCallback(response) {
                  console.log(response);
                  alert("Error enviando el correo");
              }

    );

    $scope.Volver = function () {
        localStorage.clear();
        $window.location.assign("Inicio");
    };
})
