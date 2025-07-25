# Running the Todo App

## Prerequisites

Before running the application, ensure you have:

- kubectl configured and connected to your cluster
- Access to the todo-app folder in this repository

## Setup Instructions

1. **Navigate to the todo-app directory**

   ```bash
   cd todo-app
   ```

2. **Configure secrets**
   ```bash
   cd manifests
   ```
3. **Create the secret configuration**

   - Copy the example secret file:
     ```bash
     cp secret.example.yaml secret.yaml
     ```
   - Edit `secret.yaml` with your actual values

4. **Deploy the application**
   ```bash
   kubectl apply -k .
   ```

## Notes

- The application uses Kustomize for deployment management
- Make sure to review `secret.example.yaml` for the required secret format
- All Kubernetes manifests are located in the `manifests/` directory
