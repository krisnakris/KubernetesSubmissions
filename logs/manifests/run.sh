#!/bin/bash
sops --decrypt secret.enc.yaml | kubectl apply -f - 
sleep 1
kubectl apply -f configmap.yaml
sleep 1
kubectl apply -f statefulset.yaml
sleep 3
kubectl apply -f deployment.yaml
sleep 3
kubectl apply -f combined-service.yaml
sleep 1
kubectl apply -f ingress.yaml
