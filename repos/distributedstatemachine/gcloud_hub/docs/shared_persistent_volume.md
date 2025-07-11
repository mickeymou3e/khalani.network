# Shared Persistent Volumes

In order to allow pods to use the same storage , we need to create an NFS server, and mount it to the pods.

## Prerequisites

- [g-cloud cli](https://cloud.google.com/sdk/docs/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

## Creating an NFS Server

- Create compute instance

```shell
gcloud compute instances create nfs-client --zone=us-central1-c --image-project=debian-cloud --image-family=debian-10 --tags=http-server,

 Created [https://www.googleapis.com/compute/v1/projects/civil-lambda-374300/zones/us-central1-c/instances/nfs-client].
NAME        ZONE           MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
nfs-client  us-central1-c  n1-standard-1               10.128.0.30  34.29.101.147  RUNNING
```

- Create Filestore instance (Can take a while)

```shell
gcloud filestore instances create nfs-server --zone=us-central1-c --tier=BASIC_HDD --file-share=name="vol1",capacity=1TB --network=name="default"

Waiting for [operation-1696010425957-6068332f97d33-39edcf00-4c1e4e96] to finish...done.
```

- Retrieve Information about the file store instance. We need to record the location , filestore name, filestore instance name, and IP address.

```shell
gcloud filestore instances describe nfs-server --zone=us-central1-c

createTime: '2023-09-29T18:00:30.022704545Z'
fileShares:
- capacityGb: '1024'
  name: vol1
name: projects/civil-lambda-374300/locations/us-central1-c/instances/nfs-server
networks:
- connectMode: DIRECT_PEERING
  ipAddresses:
  - 10.88.185.138
  network: default
  reservedIpRange: 10.88.185.136/29
state: READY
tier: BASIC_HDD
~/hubezkl-backend/h
```

- Mount the Filestore file share on the nfs-client instance

```shell
gcloud compute ssh nfs-client
```

- Update & upgrade the instance

```shell
sudo apt-get -y update && \
sudo apt-get -y install nfs-common
```

- Create a mount directory on the nfs-client instance for the Filestore file share:

```shell
sudo mkdir /mnt/data
```

- Mount the directory to the compute instance. Replace the IP address with the value that was retrieved when the instance was queried.

```shell
sudo mount 10.88.185.138:/vol1 /mnt/data
```

- Create the shared persistent volume
- Update the deployment files pointing to the shared storage location.
- Upgrade the helm chart
