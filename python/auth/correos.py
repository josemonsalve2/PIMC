from flask_mail import Message
from flask import render_template
from API_operaciones import mysql_connection
mail = mysql_connection.mail


def enviarCorreoConfirmacion(correoElectronico, nombreReal, nombreUsuario):
    msg = Message("[PIMCD] Usuario creado")
    msg.sender = "Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"
    msg.recipients = [correoElectronico]
    msg.bcc = ["Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"]
    msg.html= render_template("confirmacionRegistro.html", nombreUsuario=nombreUsuario, nombreReal=nombreReal)
    mail.send(msg)

def enviarCorreoActivacion(correoElectronico, nombreReal, nombreUsuario):
    msg = Message("[PIMCD] Usuario activado")
    msg.sender = "Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"
    msg.recipients = [correoElectronico]
    msg.bcc = ["Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"]
    msg.html= '''
                <h1>''' + nombreReal + '''</h1>
                <p> Su cuenta ha sido activada. </p> <br/>
                <p> Este mensaje es para confirmar la activaci&oacute;n de su cuenta en PIMDC.
                    Por favor no responda a este mensaje.
                </p>
                <p> Ahora puedes ingresar haciendo click en el enlace de ingresar en la parte
                superior derecha de nuestro <a href="pimc.fundacionproyectonavio.org"> sitio web </a>. 
                </p>

                <p>
                        <span style="font-weight:bold"> Usuario = ''' + nombreUsuario + ''' 
                        </span>
                </p>
                <p> En caso de necesitar ayuda, favor contactarnos a soporte@fundacionproyectonavio.org </p>
        '''
    mail.send(msg)

def enviarCorreoActualizacion(correoElectronico, nombreReal, nombreUsuario, viejoNivel, nuevoNivel):
    msg = Message("[PIMCD] Usuario actualizado")
    msg.sender = "Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"
    msg.recipients = [correoElectronico]
    msg.bcc = ["Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"]
    msg.html= '''
                <h1>''' + nombreReal + '''</h1>
                <p> Su cuenta ha sido actualizada. </p> <br/>
                <p> Este mensaje es para confirmar la actualizaci&oacute;n de su cuenta en PIMDC.
                    Por favor no responda a este mensaje.
                </p>
                <p> Su cuenta fue cambiada de nivel ''' + viejoNivel + ''' a nivel ''' + nuevoNivel + ''' </a>. 
                </p>

                <p> En caso de necesitar ayuda, favor contactarnos a soporte@fundacionproyectonavio.org </p>
        '''
    mail.send(msg)