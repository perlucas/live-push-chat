import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Message } from '../Message.model';
import { NotificationService } from './NotificationService.service';

@Injectable({ providedIn: 'root' })
export class MessagesService implements OnDestroy {
    
    private messages: Message[] = [];
    private lastMessage: Message;
    private updatedMessages$ = new Subject<Message[]>();
    private socket: any;

    constructor(private http: HttpClient, private notifier: NotificationService) {}

    getUpdatedMessagesAsObservable() { return this.updatedMessages$.asObservable(); }

    addNewMessages(messages: Message[]) {
        const initialNumberOfMessages = this.messages.length;

        if (this.messages.length) {
            messages
                .filter(m => m.id > this.lastMessage.id)
                .forEach(m => this.messages.push(m));
        } else {
            this.messages = messages;
        }

        if (this.messages.length) {
            this.lastMessage = this.messages[this.messages.length - 1];
        }
        
        this.updatedMessages$.next([...this.messages]);
        this.notifier.notifyNewMessages(this.messages.length - initialNumberOfMessages);
    }

    startLiveReloading() {
        this.http.get(environment.serverHost + "/messages", { withCredentials: true })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    console.error("An error ocurred: " + err.message + " Code: " + err.status);
                    return of();
                })
            )
            .subscribe((response: any) => {
                this.addNewMessages(response.data.messages)
                this.setUpSocket();
            });
    }

    private setUpSocket() {
        this.socket = io(environment.serverHost);
        this.socket.on('new-message', (data) => {
            this.addNewMessages([data]);
        });
    }

    ngOnDestroy(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    sendNewMessage(content: string): void {
        this.http.post(environment.serverHost + "/messages", { content }, { withCredentials: true })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    console.error("An error ocurred: " + err.message + " Code: " + err.status);
                    return of();
                })
            )
            .subscribe();
    }

}