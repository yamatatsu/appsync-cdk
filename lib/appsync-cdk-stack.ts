import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class AppSyncPlayGroundStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const itemTable = new dynamodb.Table(this, "ItemTable", {
      partitionKey: {
        name: "itemId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const itemsGraphQLApi = new appsync.GraphqlApi(this, "ItemsApi", {
      name: "items-api",
    });

    const itemDS = itemsGraphQLApi.addDynamoDbDataSource("item", itemTable);

    const itemType = itemsGraphQLApi.addType(
      new appsync.ObjectType("Item", {
        definition: {
          itemId: appsync.GraphqlType.id({ isRequired: true }),
          name: appsync.GraphqlType.string(),
        },
      })
    );
    const paginatedItemsType = itemsGraphQLApi.addType(
      new appsync.ObjectType("PaginatedItems", {
        definition: {
          items: itemType.attribute({ isList: true }),
          nextToken: appsync.GraphqlType.string(),
        },
      })
    );

    itemsGraphQLApi.addQuery(
      "all",
      new appsync.ResolvableField({
        returnType: paginatedItemsType.attribute({ isRequired: true }),
        args: {
          limit: appsync.GraphqlType.int(),
          nextToken: appsync.GraphqlType.string(),
        },
        dataSource: itemDS,
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
      })
    );
    itemsGraphQLApi.addQuery(
      "getOne",
      new appsync.ResolvableField({
        returnType: itemType.attribute(),
        args: {
          itemId: appsync.GraphqlType.id(),
        },
        dataSource: itemDS,
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem(
          "itemId",
          "itemId"
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
      })
    );
    itemsGraphQLApi.addMutation(
      "save",
      new appsync.ResolvableField({
        returnType: itemType.attribute(),
        args: { name: appsync.GraphqlType.string({ isRequired: true }) },
        dataSource: itemDS,
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
          new appsync.PartitionKeyStep("itemId").auto(),
          appsync.Values.projecting()
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
      })
    );
    itemsGraphQLApi.addMutation(
      "delete",
      new appsync.ResolvableField({
        returnType: itemType.attribute(),
        args: { itemId: appsync.GraphqlType.id({ isRequired: true }) },
        dataSource: itemDS,
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem(
          "itemId",
          "itemId"
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
      })
    );
  }
}
