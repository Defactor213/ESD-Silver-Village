import pika
import os
import json
from jinja2 import Environment, FileSystemLoader, select_autoescape
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

jinja_env = Environment(
  loader=FileSystemLoader("templates/content"),
  autoescape=select_autoescape()
)

rabbitmq_url = os.environ['RABBITMQ_URL']
smtp_host = os.environ["SMTP_HOST"]
smtp_port = os.environ["SMTP_PORT"]
smtp_user = os.environ["SMTP_USER"]
smtp_pass = os.environ["SMTP_PASS"]
email_from = os.environ["EMAIL_FROM"]

connection = pika.BlockingConnection(
  pika.URLParameters(rabbitmq_url)
)

channel = connection.channel()

channel.exchange_declare(exchange="notification_topic", exchange_type="topic", durable=True)

###### Notification queue ########
channel.queue_declare(queue="notifications", durable=True)
channel.queue_bind(exchange="notification_topic", queue="notifications", routing_key="notification.*")

def callback(channel, method, properties, body):
  print("Received AMQP message", body)
  message = json.loads(body)

  recipient = message['recipient']
  template = message['template']
  data = message['data']

  jinja_template = jinja_env.get_template("%s.html" % template)
  rendered_html = jinja_template.render(data)

  message = MIMEMultipart()
  message['From'] = email_from
  message['To'] = recipient
  message.attach(MIMEText(rendered_html, 'html'))

  with open("templates/subject/%s.txt" % template) as f:
    message['Subject'] = f.readline()
  
  session = smtplib.SMTP(smtp_host, int(smtp_port))
  session.starttls()
  session.login(smtp_user, smtp_pass)
  session.sendmail(email_from, recipient, message.as_string())
  session.quit()

  print("Email sent template=%s recipient=%s" % (template, recipient))

if __name__ == "__main__":
  print("Notification Service listening")

  channel.basic_consume(queue="notifications", on_message_callback=callback, auto_ack=True)
  channel.start_consuming()
