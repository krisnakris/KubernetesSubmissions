#!/bin/bash
sops --decrypt secret.enc.yaml | kubectl apply -f - 
sleep 5
kubectl apply -f configmap.yaml
sleep 5
kubectl apply -f statefulset.yaml
sleep 5
kubectl apply -f persistentvolume.yaml
sleep 3
kubectl apply -f persistentvolumeclaim.yaml
sleep 3
kubectl apply -f deployment.yaml
sleep 3
kubectl apply -f service.yaml
sleep 3
kubectl apply -f ingress.yaml
