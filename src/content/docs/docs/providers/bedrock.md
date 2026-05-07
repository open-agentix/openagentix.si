---
title: AWS Bedrock
description: Use Bedrock through a VPC interface endpoint or an HTTPS proxy, with IRSA on EKS and no static keys.
sidebar:
  order: 4
---

```json
{
  "kind": "bedrock",
  "name": "bedrock",
  "region": "eu-central-1",
  "endpoint": "https://vpce-0abc123-xyz.bedrock-runtime.eu-central-1.vpce.amazonaws.com"
}
```

openagentix calls Bedrock through the **Converse API** with the AWS SDK v3.

| Field | Meaning |
| --- | --- |
| `region` | required |
| `endpoint` | optional VPC interface endpoint for `bedrock-runtime` |
| `proxyUrl` | optional HTTPS proxy |
| `maxRetries` | retries (`maxAttempts` = `maxRetries + 1`) |

The default clearance is `confidential`.

## Credentials

Credentials come from the AWS default provider chain, so no keys belong in the configuration:

- **EKS with IRSA:** annotate the platform's service account with
  `eks.amazonaws.com/role-arn: arn:aws:iam::<account>:role/<role>`. The SDK uses
  `AWS_WEB_IDENTITY_TOKEN_FILE` and `AWS_ROLE_ARN` automatically.
- **EC2 or ECS:** instance or task roles.
- **Developer machines:** SSO or environment variables.

The role needs `bedrock:InvokeModel` (and `bedrock:InvokeModelWithResponseStream` if streaming is
used) on the models you allow.

## Private networking

### VPC interface endpoint

1. Create an interface endpoint for `com.amazonaws.<region>.bedrock-runtime` in the VPC of your
   cluster, in the subnets of your nodes.
2. Allow HTTPS (443) from the nodes' security group to the endpoint's security group.
3. Either enable private DNS on the endpoint (then no `endpoint` field is needed), or set
   `endpoint` to the endpoint-specific DNS name as above.
4. Optionally restrict the endpoint policy to the roles and models you use.

Traffic then stays inside AWS and never crosses the public internet.

### HTTPS proxy

Where all egress must pass a proxy, set `proxyUrl`, for example
`http://proxy.internal:3128`. Allow `bedrock-runtime.<region>.amazonaws.com` on the proxy.

## Kubernetes network policy

With the Helm chart's default-deny policy, allow egress from the worker pods to the endpoint (or
proxy) only. See [Helm, Kubernetes and EKS](/docs/deploy/helm/).
