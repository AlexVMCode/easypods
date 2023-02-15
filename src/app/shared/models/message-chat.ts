import { Injectable } from "@angular/core";
import { Adapter } from "../adapters/adapter";
import { TypeMessage } from "../enum/type-message";
import { ChatUtils } from "../functions/chat-utils";
import { FileUtils } from "../functions/file-utils";

export class MessageChat {
    origin: string;
    createAt: string;
    body: string;
    messageType: string;
    options: {
        customClass: string,
        height: string,
        width: string
    }

    constructor(
        origin: string,
        createAt: string,
        body: string,
        messageType: string,
        options: { customClass: string; height: string; width: string; },
    ) {
        this.origin = origin;
        this.createAt = createAt;
        this.body = body;
        this.messageType = messageType;
        this.options = options;
    }
}

@Injectable({
    providedIn: "root",
})
export class MessageChatAdapter implements Adapter<MessageChat> {

    constructor(private chatUtils: ChatUtils, private fileUtils: FileUtils) { }

    adapt(item: any): MessageChat {

        let messageType: string = TypeMessage.text;
        let body: string = item.messageBody;
        let options: { customClass: string; height: string; width: string; } = {
            customClass: "my-message",
            height: "",
            width: "",
        };

        if (item.messageType == 'EasyPODS') {
            options.customClass = "other-message float-right";
        }

        if (this.chatUtils.isURLMultimedia(body)) {
            body = this.chatUtils.cleanURL(body);
            let extension = this.fileUtils.getExtension(body);
            let type = this.fileUtils.getType(extension);
            if (type) {
                messageType = type;

                switch (messageType) {
                    case TypeMessage.document:
                        options.height = "102px";
                        options.width = "336px";
                        break;
                    case TypeMessage.audio:
                        options.height = "102px";
                        options.width = "336px";
                        break;
                    case TypeMessage.image:
                        options.height = "185";
                        options.width = "330";
                        break;
                    default:
                        break;
                }
            }
        }

        return new MessageChat(
            item.messageType,
            item.createAt,
            body,
            messageType,
            options
        )
    }
}