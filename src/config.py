import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import pickle
import base64

# Configuración de Cloudinary
cloudinary.config(
    cloud_name='dlaihh06x',
    api_key='738355329821344',
    api_secret='-K-DiIuzjAjqGgtRCGb441eqUw0'
)

# Configuración de OAuth 2.0 para Gmail
GMAIL_CLIENT_SECRET_FILE = 'src/client_secret.json'
GMAIL_TOKEN_FILE = 'src/token.pickle'
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def get_gmail_service():
    creds = None
    if os.path.exists(GMAIL_TOKEN_FILE):
        with open(GMAIL_TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(GMAIL_CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=3002)
        with open(GMAIL_TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_email_via_gmail(to, subject, body):
    service = get_gmail_service()
    message = MIMEText(body)
    message['to'] = to
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    raw = {'raw': raw_message}
    try:
        message = (service.users().messages().send(userId="me", body=raw).execute())
        print(f"Message Id: {message['id']}")
    except Exception as error:
        print(f"Error al enviar el correo: {error}")

def send_reset_email(user):
    token = user.reset_token
    reset_url = f"https://zany-fiesta-pj7g4vj4767qcr64x-3001.app.github.dev/reset_password/{token}"  # URL del frontend
    email_body = f"¡Hola! Para restablecer tu contraseña, por favor haz clic en el siguiente enlace: {reset_url}. Si no has solicitado este cambio, puedes ignorar este correo de manera segura. Saludos del equipo de Kuentas Klaras."
    send_email_via_gmail(user.email, "KuentasKlaras. Restablecimiento de contraseña", email_body)
