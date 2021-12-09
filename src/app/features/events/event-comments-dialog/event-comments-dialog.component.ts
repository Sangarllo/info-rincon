import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { IEvent } from '@models/event';
import { IEventComment } from '@models/event-comment';
import { EventsCommentsService } from '@services/events-comments.service';

@Component({
  selector: 'app-event-comments-dialog',
  templateUrl: './event-comments-dialog.component.html',
  styleUrls: ['./event-comments-dialog.component.scss']
})
export class EventCommentsDialogComponent implements OnInit, OnDestroy {

  title = 'Últimos comentarios';
  errorMessage = '';
  eventComment: IEventComment;
  eventCommentForm: FormGroup;
  public eventComments$: Observable<IEventComment[]>;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private eventsCommentsSrv: EventsCommentsService,
    public dialogRef: MatDialogRef<EventCommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public eventId: string) {
  }

  ngOnInit(): void {

    console.log(`eventId: ${JSON.stringify(this.eventId)}`);
    this.eventComments$ = this.eventsCommentsSrv.getAllEventComments(this.eventId);

      this.eventCommentForm = this.fb.group({
        message: [ '', []],
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendComment(): void {
    this.eventsCommentsSrv.addEventComment(
        this.eventId,
        this.eventCommentForm.controls.message.value
    ).then(
      (eventComment: IEventComment) => {

          Swal.fire({
            icon: 'success',
            title: 'Comentario enviado con éxito',
          });

          this.eventCommentForm.reset();
        })
      .catch(
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar el comentario',
            text: error.message
          });
        });
  }

  deleteComment(eventComment: IEventComment): void {
    this.eventsCommentsSrv.deleteEventComment(eventComment.id);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
