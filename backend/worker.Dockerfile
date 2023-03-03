FROM python:3.10.4

WORKDIR worker

COPY . .

RUN pip install -r requirements.txt

CMD ["rq", "worker", "insert", "--url", "redis://greendashboard.redis"]