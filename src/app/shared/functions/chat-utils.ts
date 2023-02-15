import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ChatUtils {

    isURLMultimedia(url: string): boolean {
        return url.startsWith('**');
    }

    cleanURL(url: string): string {
        let strings = url.split('**');
        return strings[1];
    }
}