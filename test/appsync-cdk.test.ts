import { expect as expectCDK, haveResource } from "@aws-cdk/assert"
import cdk = require("@aws-cdk/core")
import AppsyncCdk = require("../lib/appsync-cdk-stack")

test("SQS Queue Created", () => {
  const app = new cdk.App()
  // WHEN
  const stack = new AppsyncCdk.AppSyncPlayGroundStack(app, "MyTestStack")
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::SQS::Queue", {
      VisibilityTimeout: 300,
    }),
  )
})

test("SNS Topic Created", () => {
  const app = new cdk.App()
  // WHEN
  const stack = new AppsyncCdk.AppSyncPlayGroundStack(app, "MyTestStack")
  // THEN
  expectCDK(stack).to(haveResource("AWS::SNS::Topic"))
})
