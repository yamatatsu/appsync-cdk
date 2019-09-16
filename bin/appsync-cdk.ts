#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { AppsyncCdkStack } from '../lib/appsync-cdk-stack';

const app = new cdk.App();
new AppsyncCdkStack(app, 'AppsyncCdkStack');