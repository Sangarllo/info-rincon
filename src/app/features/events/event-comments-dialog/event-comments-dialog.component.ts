/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { IEventComment } from '@models/comment';
import { CommentsService } from '@services/comments.service';
import { UserRole } from '@models/user-role.enum';

@Component({
  selector: 'app-event-comments-dialog',
  templateUrl: './event-comments-dialog.component.html',
  styleUrls: ['./event-comments-dialog.component.scss']
})
export class EventCommentsDialogComponent implements OnInit, OnDestroy {

  title = 'Últimos comentarios';
  errorMessage = '';
  public eventId: string;
  eventComment: IEventComment;
  eventCommentForm: FormGroup;
  public userUid: string;
  public userRole: string;
  public eventComments$: Observable<IEventComment[]>;
  private listOfObservers: Array<Subscription> = [];

  commentator: any;
  commentatorAsUser: any;
  commentatorAsEntity: any;
  commentatorAsSuper: any;

  constructor(
    private fb: FormBuilder,
    private eventsCommentsSrv: CommentsService,
    public dialogRef: MatDialogRef<EventCommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.eventId = this.data.eventId;
    this.userUid = this.data.UserUid;
    this.userRole = this.data.UserRole;
    this.eventComments$ = this.eventsCommentsSrv.getAllEventComments(this.eventId);

      this.eventCommentForm = this.fb.group({
        message: [ '', []],
      });

    this.commentatorAsUser = {
      name: this.data.UserName,
      image: this.data.UserImage,
    };

    this.commentatorAsEntity = (this.data.EntityName) ? {
      name: this.data.EntityName,
      image: this.data.EntityImage,
    } : null;

    this.commentatorAsSuper = {
      name: 'Agenda Rinconera',
      image: 'assets/icons/logo-agenda-rinconera.png',
    };

    this.commentator = this.commentatorAsUser;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendComment(): void {
    this.eventsCommentsSrv.addEventComment(
        this.eventId,
        this.commentator.name,
        this.commentator.image,
        this.eventCommentForm.controls.message.value
    ).then(
      (eventComment: IEventComment) => {

          Swal.fire({
            icon: 'success',
            title: 'Comentario enviado con éxito',
            confirmButtonColor: '#003A59',
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

  canDelete(eventComment: IEventComment): boolean {
    return this.userRole === UserRole.Admin ||
    this.userRole === UserRole.Super ||
    this.userUid === eventComment.userUid;
  }

  deleteComment(eventComment: IEventComment): void {
    this.eventsCommentsSrv.deleteEventComment(eventComment.id);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
