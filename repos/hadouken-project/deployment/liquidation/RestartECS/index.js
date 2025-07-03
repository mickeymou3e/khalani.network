"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const ecs = new aws_sdk_1.ECS();
function any(elements) {
    for (const element of elements) {
        if (!!element)
            return true;
    }
    return false;
}
const handler = async (event) => {
    const ecrImage = `${event.account}.dkr.ecr.${event.region}.amazonaws.com/${event.detail['repository-name']}:${event.detail['image-tag']}`;
    console.log({ message: 'Noticed change of ECR tag', ecrImage });
    const { clusterArns } = await ecs.listClusters().promise();
    await Promise.all(clusterArns.map(async (cluster) => {
        console.log({ message: 'Analyzing cluster', cluster });
        const { serviceArns } = await ecs.listServices({ cluster, maxResults: 100 }).promise();
        await Promise.all(serviceArns.map(async (serviceArn) => {
            console.log({ message: 'Analyzing service', serviceArn });
            const { services } = await ecs.describeServices({ cluster, services: [serviceArn] }).promise();
            console.log({ message: 'Getting task defintion', taskDefinition: services[0].taskDefinition });
            const params = {
                taskDefinition: services[0].taskDefinition
            };
            const { taskDefinition } = await ecs.describeTaskDefinition(params).promise();
            console.log({ taskDefinition });
            if (any(taskDefinition.containerDefinitions.map(({ image }) => image === ecrImage))) {
                console.log({ message: 'Restarting service', cluster, serviceArn });
                const params = { service: serviceArn, cluster, forceNewDeployment: true };
                const output = await ecs.updateService(params).promise();
                console.log({ message: 'done', output });
            }
        }));
    }));
};
module.exports.default = handler;
