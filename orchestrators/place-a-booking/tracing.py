from os import environ
import time
from flask import Flask
import pika
from flask_zipkin import Zipkin

connection = None
channel = None

rabbitmq_url = environ.get('RABBITMQ_URL')

def connect_to_amqp():
  global connection
  global channel

  connection = pika.BlockingConnection(
    pika.URLParameters(rabbitmq_url)
  )

  channel = connection.channel()

def setup_tracing(app: Flask):

  zipkin = Zipkin(app, sample_rate=100)

  connect_to_amqp()

  @zipkin.transport_handler
  def default_handler(encoded_span):
    try:
      channel.basic_publish(exchange='zipkin', routing_key='zipkin', body=encoded_span)
    except:
      print('Try to reconnect in 5 seconds')
      time.sleep(1)

      connect_to_amqp()
      default_handler(encoded_span)
