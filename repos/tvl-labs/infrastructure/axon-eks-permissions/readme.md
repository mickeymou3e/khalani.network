Apply:
```
aws eks update-kubeconfig --name axon-eks --region us-east-1 --profile k8sadmin
kubectl apply -f dev-role.yml
```

Example output:
```
➜ kubectl apply -f axon-eks-permissions/dev-role.yml 
role.rbac.authorization.k8s.io/dev-role created
rolebinding.rbac.authorization.k8s.io/dev-role-binding created
role.rbac.authorization.k8s.io/dev-role created
rolebinding.rbac.authorization.k8s.io/dev-role-binding created
```