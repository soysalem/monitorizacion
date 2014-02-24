/*Copyright 2014 Felix M

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/
//blablablablalbla
var http = require('http'),
    url = require('url'),
	contador = 0,
	nodemailer = require("nodemailer");

var procesarRegistrar = function(request, response, urlParseada) {
	if (request.method == 'GET') {
		response.writeHead(200, {  //writeHead writes the HTTP header (status code 200). Iniciaria una secuancia de texto
			'Content-Type' : 'text/html'
		});			
		response.write('<p>Instancia ' + 
					   urlParseada.query.instancia + 
					   ' registrada</p>');
	} else {
		response.writeHead(405);	
	}
	response.end();  //end writes the body and closes the response. Finalizaria una secuencia de texto
}	
	
var procesarEstadistica = function(request, response) {
	if (request.method == 'POST') {
		var datos = '';
		
		request.on('data', function(nuevosDatos) {
			datos = datos + nuevosDatos.toString();
			
		});
		request.on('end', function() {
		
		var json = JSON.parse(datos);  //los datos los recibimos en JSON y se transcriben
		
			
			if (json.usoCPU60seg > 20){ 	//si el procesador está por encima del 20%. usoCPU60seg viene del 'Agente.js'
			
			contador = contador +1;
			
			console.log('Aviso numero: '+contador);
			
				if (contador ==2){
				
					// !!!
					response.writeHead(200); 
					console.log('****************************');
					console.log('Agente: ' + json.id);
					console.log('Sobrepasa el uso deseado del 20% de CPU');
					console.log(json.usoCPU60seg);
					console.log('****************************');
					response.end(); 
										
					contador = 0;
				}
			
			}
			
		});
	} else {
		response.writeHead(405);
		response.end();
		
	}
}

var transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

console.log('Sendmail Configured');

// Message object
var message = {
    // sender info
    from: 'Sender Name <sender@example.com>',

    // Comma separated list of recipients
    to: '"Receiver Name" <nodemailer@disposebox.com>',

    // Subject of the message
    subject: 'Nodemailer is unicode friendly ✔', //

    // plaintext body
    text: 'Hello to myself!',

    // HTML body
    html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
         '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>',
console.log('Sending Mail');

	transport.sendMail(message, function(error){
		if(error){
			console.log('Error occured');
			console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');
});
	
	
	
var procesador = function(request, response) {
	var urlParseada = url.parse(request.url, true);
	
	if (urlParseada.pathname == '/registrar') {
		procesarRegistrar(request, response, urlParseada);
	} else if (urlParseada.pathname = '/estadistica') {
		procesarEstadistica(request, response);
	} else {
		response.writeHead(404);
		response.end();
	}
}

var server = http.createServer(procesador);
server.listen(80);