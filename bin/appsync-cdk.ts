#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { AppSyncPlayGroundStack } from '../lib/appsync-cdk-stack';

const app = new cdk.App();
new AppSyncPlayGroundStack(app, 'AppSyncPlayGroundStack');