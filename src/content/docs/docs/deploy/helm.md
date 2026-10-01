---
title: Helm, Kubernetes and EKS
description: Install openagentix on Kubernetes or Amazon EKS with the Helm chart - secure defaults, IRSA, network policies and autoscaling.
sidebar:
  order: 1
---

The `openagentix` chart (0.2.1) installs a complete stack with one command (bundled PostgreSQL and Valkey, generated credentials, demo and air-gapped modes). The chart lives in
[open-agentix/open-agentix-helm](https://github.com/open-agentix/open-agentix-helm).
Value names may still change before 1.0; the chart's `values.yaml` is authoritative.

## What the chart deploys

- **api** (control node), **worker** and **ui** deployments;
- PostgreSQL as an optional bundled dependency, or an external database;
- a migrations Job as a Helm hook;
- NetworkPolicies with **default deny** and explicit egress;
- PodSecurity `restricted` (non-root, read-only root file system, no privilege escalation);
- HorizontalPodAutoscaler, PodDisruptionBudget and a `ServiceMonitor` for the Prometheus Operator;
- ingress for nginx or the AWS Load Balancer Controller (ALB).

## Install

```sh
kubectl create namespace openagentix
kubectl -n openagentix create secret generic openagentix-secrets \
  --from-literal=database-url='postgres://…' \
  --from-file=audit-signing-key=./audit-ed25519.pem
helm install openagentix ./charts/openagentix -n openagentix -f values.yaml
```

Publishing the chart as a Helm repository and as an OCI artifact is on the roadmap.

## Values (illustrative)

```yaml
database:
  external: true
  existingSecret: openagentix-secrets

auth:
  oidc:
    issuer: https://login.example.com/realms/main
    clientId: openagentix
    existingSecret: openagentix-oidc

ingress:
  className: alb            # or nginx
  host: agents.example.com

networkPolicy:
  enabled: true             # default deny
  egress:
    - to: bedrock-vpc-endpoint
      cidr: 10.0.12.0/24
      ports: [443]

serviceAccount:
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/openagentix-bedrock
```

## EKS and Bedrock

1. Create an IAM role for IRSA that trusts your cluster's OIDC provider and the chart's service
   account, with `bedrock:InvokeModel` on the allowed models.
2. Annotate the service account with the role ARN (see above).
3. Create a Bedrock VPC interface endpoint or set a proxy, and allow it in the network policy.
4. Configure the [Bedrock provider](/docs/providers/bedrock/) without any static keys.

From 0.2, the `kubernetes-job` [runner](/docs/concepts/runners/) starts one Job per run in the
`openagentix-runs` namespace with its own service account (`openagentix-worker`), IRSA annotation
and NetworkPolicy.
