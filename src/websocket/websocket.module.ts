import { Module } from "@nestjs/common";

// Sources
import { WebsocketGateway } from './websocket.gateway'

@Module({
    providers: [WebsocketGateway]
})
export class WebSocketModule {}