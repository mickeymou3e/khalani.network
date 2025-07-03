admin_email        = "admin@tunnelvisionlabs.xyz"
aws_hosted_zone_id = "Z08187603SUPEDOLVG3SQ"
domain_name        = "khalani.network"
domain_certificate = "arn:aws:acm:us-east-1:803035318642:certificate/adc6a739-925b-40a5-9537-4306e0e3dc56"

# Cluster
min_size         = "3"
max_size         = "7"
desired_size     = "4"
instance_types   = ["t3a.xlarge"]
ec2_ssh_key      = "axon-eks"
cluster_name     = "axon-eks"
cluster_endpoint = "https://32803539C78C654C14D84BD9DDB105D9.gr7.us-east-1.eks.amazonaws.com"
disk_size        = "60"
validator_count  = 3

# Hyperlane
chains = ["sepolia", "fuji", "khalani-testnet"]

# VPC
vpc_cidr        = "10.4.0.0/16"
vpc_name        = "axon-10-4"
azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
private_subnets = ["10.4.64.0/19", "10.4.96.0/19", "10.4.128.0/19"]
public_subnets  = ["10.4.160.0/19", "10.4.192.0/19", "10.4.224.0/19"]