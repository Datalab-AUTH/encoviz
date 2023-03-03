# heart-api

Install the packages:
```commandline
pip install -r requirements.txt
```

Run the server:
```commandline
uvicorn main:app --reload
```

Run the worker for REDIS:
```commandline
rq worker insert --url redis://localhost:6379
```
