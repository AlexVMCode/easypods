import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { RecordedAudioOutput } from '../interfaces/recorded-audio-output';
import { Observable, Subject } from 'rxjs';
// import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService extends BaseService {

  constructor(public http: HttpClient) {
    super()
  }
  // private stream: MediaStream | null;
  // private recorder: RecordRTC.StereoAudioRecorder | null;
  // private interval: any;
  // private startTime: moment.Moment | null;
  // private _recorded = new Subject<RecordedAudioOutput>();
  // private _recordingTime = new Subject<string>();
  // private _recordingFailed = new Subject<string>();


  // getRecordedBlob(): Observable<RecordedAudioOutput> {
  //   return this._recorded.asObservable();
  // }

  // getRecordedTime(): Observable<string> {
  //   return this._recordingTime.asObservable();
  // }

  // recordingFailed(): Observable<string> {
  //   return this._recordingFailed.asObservable();
  // }

  // startRecording() {
  //   if (this.recorder) {
  //     // It means recording is already started or it is already recording something
  //     return;
  //   }

  //   this._recordingTime.next('00:00');
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  //     .then(s => {
  //       this.stream = s;
  //       this.record();
  //     }).catch(error => {
  //       this._recordingFailed.next('00:00');
  //     });
  // }

  // abortRecording() {
  //   this.stopMedia();
  // }

  // private record() {
  //   if (this.stream) {
  //     this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
  //       type: 'audio',
  //       mimeType: 'audio/wav'
  //     });

  //     this.recorder.record();
  //     this.startTime = moment();
  //     this.interval = setInterval(
  //       () => {
  //         const currentTime = moment();
  //         const diffTime = moment.duration(currentTime.diff(this.startTime));
  //         const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
  //         this._recordingTime.next(time);
  //       },
  //       500
  //     );
  //   }

  // }

  // private override toString(value: number): string {
  //   let val: string = value.toString();
  //   if (!value) {
  //     val = '00';
  //   }
  //   if (value < 10) {
  //     val = '0' + value;
  //   }
  //   return val;
  // }

  // stopRecording() {
  //   if (this.recorder) {
  //     this.recorder.stop((blob: Blob) => {
  //       if (this.startTime) {
  //         const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
  //         this.stopMedia();
  //         this._recorded.next({ blob: blob, title: mp3Name });
  //       }
  //     }

  //       // , (error) => {
  //       //   this.stopMedia();
  //       //   this._recordingFailed.next('00:00');
  //       // }

  //     );
  //   }
  // }

  // private stopMedia() {
  //   if (this.recorder) {
  //     this.recorder = null;
  //     clearInterval(this.interval);
  //     this.startTime = null;
  //     if (this.stream) {
  //       this.stream.getAudioTracks().forEach(track => track.stop());
  //       this.stream = null;
  //     }
  //   }
  // }
  
}
