#!/bin/bash
sops --decrypt secret.enc.yaml | kubectl apply -f - 
kubectl apply -f configmap.yaml
kubectl apply -f statefulset.yaml
sleep 3
kubectl apply -f persistentvolume.yaml
sleep 1
kubectl apply -f persistentvolumeclaim.yaml
sleep 1
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
