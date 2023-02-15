import { Injectable } from '@angular/core';
import { TypeMessage } from '../enum/type-message';
import { ComboFile } from '../interfaces/combo-file';

@Injectable({
    providedIn: 'root',
})
export class FileUtils {

    getAllowTypes() {
        let listTypes: ComboFile[] = [
            {
                label: TypeMessage.image,
                value: 'image/png',
                extension: '.png',
            },
            {
                label: TypeMessage.image,
                value: 'image/jpeg',
                extension: '.jpeg',
            },
            {
                label: TypeMessage.image,
                value: 'image/jpg',
                extension: '.jpg',
            },
            {
                label: TypeMessage.document,
                value: 'text/plain',
                extension: '.txt',
            },
            {
                label: TypeMessage.document,
                value: 'application/pdf',
                extension: '.pdf',
            },
            {
                label: TypeMessage.document,
                value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                extension: '.xlsx',
            },
            {
                label: TypeMessage.document,
                value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                extension: '.pptx',
            },
            {
                label: TypeMessage.document,
                value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                extension: '.docx',
            },
            {
                label: TypeMessage.audio,
                value: 'audio/mpeg',
                extension: '.mp3',
            },
            {
                label: TypeMessage.audio,
                value: 'audio/ogg',
                extension: '.ogg',
            },
        ];
        return listTypes;
    }

    getAllowTypesFormated() {
        let allowTypes = '';
        let listTypes = this.getAllowTypes();
        listTypes.forEach((item, index, array) => {
            allowTypes = allowTypes + item.value + ',';
        });
        return allowTypes;
    }

    isAllowType(type: string): string | undefined {
        let listTypes = this.getAllowTypes();
        let item = listTypes.find(item => item.value == type);
        return item ? item.label : undefined;
    }

    getType(extension: string): string | undefined {
        let listTypes = this.getAllowTypes();
        let item = listTypes.find(item => item.extension == extension);
        return item ? item.label : undefined;
    }

    getExtension(url: string): string {
        let extension = '.' + url.split('.').pop();
        return extension;
    }

    base64ToFile(base64Image: string): Blob {
        const split = base64Image.split(',');
        const type = split[0].replace('data:', '').replace(';base64', '');
        const byteString = atob(split[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type });
    }

}