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
    msg.html= render_template("confirmacionActivacion.html", nombreUsuario=nombreUsuario, nombreReal=nombreReal)
    mail.send(msg)

def enviarCorreoActualizacion(correoElectronico, nombreReal, nombreUsuario, viejoNivel, nuevoNivel):
    msg = Message("[PIMCD] Usuario actualizado")
    msg.sender = "Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"
    msg.recipients = [correoElectronico]
    msg.bcc = ["Fundacion Proyecto Navio <registro@fundacionproyectonavio.org>"]
    msg.html = render_template("confirmacionActualizacion.html", nombreUsuario=nombreUsuario, nombreReal=nombreReal, nivelAnterior=viejoNivel, nivelActual=nuevoNivel)
    mail.send(msg)