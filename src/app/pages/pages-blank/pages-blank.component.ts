import { Component, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-pages-blank',
  templateUrl: './pages-blank.component.html',
  styleUrls: ['./pages-blank.component.css']
})
export class PagesBlankComponent implements OnInit {

  // Record Audio
  showInputAudio: boolean = false;
  recordingStarted: boolean = false;
  // recordingPaused: boolean = false;
  audioBlob: Blob;
  audioBlobURL: SafeUrl;
  // audioFile: File;
  private interval: any;
  private startTime: moment.Moment | null;
  audioRecordedTime: string = '00:00';
  ffmpeg = createFFmpeg({ log: true });
  recordRTC: RecordRTC;

  constructor() { }

  ngOnInit(): void {
    this.startRecording();
  }

  startRecording() {
    this.showInputAudio = true;
    this.recordingStarted = true;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.recordRTC = new RecordRTC(stream, {
        type: 'audio',
        mimeType: "audio/wav",
        sampleRate: 44100,
        numberOfAudioChannels: 2
      });
      this.startTime = moment();
      this.interval = setInterval(() => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time =
          this.toString(diffTime.minutes()) +
          ":" +
          this.toString(diffTime.seconds());
        this.audioRecordedTime = time;
      }, 1000);
      this.recordRTC.startRecording();
    });
  }

  async stopRecording() {
    this.recordingStarted = false;
    clearInterval(this.interval);
    this.recordRTC.stopRecording(async () => {
      this.audioBlob = this.recordRTC.getBlob();
      this.audioBlobURL = URL.createObjectURL(this.audioBlob);
      console.log(this.audioBlob);
      console.log(this.audioBlobURL);
      // aquí puedes convertir el archivo a formato mp3 utilizando una biblioteca como "ffmpeg.js"
      // Carga el archivo de audio grabado en ffmpeg
      await this.ffmpeg.load();
      this.ffmpeg.FS('writeFile', 'audio.wav', await fetchFile(this.audioBlob));

      // Convierte el archivo a formato mp3 utilizando FFmpeg
      await this.ffmpeg.run('-i', 'audio.wav', '-c:a', 'libmp3lame', 'output.mp3');

      // Lee el archivo convertido de la memoria de ffmpeg
      const data = this.ffmpeg.FS('readFile', 'output.mp3');
      const mp3Blob = new Blob([data.buffer], { type: 'audio/mp3' });
      this.audioBlobURL = URL.createObjectURL(mp3Blob);

      console.log(mp3Blob);
    });
  }

  async loadFFmpeg() {
    await this.ffmpeg.load();
  }

  sendAudio() {
    console.log(this.audioBlob)
    // this.file = new File([this.audioBlob], "audio.mp3", { lastModified: Date.now(), type: this.audioBlob.type });
    // console.log(this.file);
    // this.saveFile();
    // this._downloadFile();
  }

  private toString(value: number): string {
    let val: string = value.toString();
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }
}
