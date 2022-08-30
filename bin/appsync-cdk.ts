import * as cdk from "aws-cdk-lib";
import { AppSyncPlayGroundStack } from "../lib/appsync-cdk-stack";

const app = new cdk.App();
new AppSyncPlayGroundStack(app, "AppSyncPlayGroundStack");
