import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { INotice } from '@models/notice';
import { INoticeComment } from '@models/comment';
import { CommentsService } from '@services/comments.service';
import { User } from '../../../core/models/user';
import { UserRole } from '@models/user-role.enum';

@Component({
  selector: 'app-notice-comments-dialog',
  templateUrl: './notice-comments-dialog.component.html',
  styleUrls: ['./notice-comments-dialog.component.scss']
})
export class NoticeCommentsDialogComponent implements OnInit, OnDestroy {

  title = 'Últimos comentarios';
  errorMessage = '';
  public noticeId: string;
  noticeComment: INoticeComment;
  commentForm: FormGroup;
  public userUid: string;
  public userRole: string;
  public noticeComments$: Observable<INoticeComment[]>;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private commentsSrv: CommentsService,
    public dialogRef: MatDialogRef<NoticeCommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.noticeId = this.data.noticeId;
    this.userUid = this.data.UserUid;
    this.userRole = this.data.UserRole;
    this.noticeComments$ = this.commentsSrv.getAllNoticeComments(this.noticeId);

      this.commentForm = this.fb.group({
        message: [ '', []],
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendComment(): void {
    this.commentsSrv.addNoticeComment(
        this.noticeId,
        this.commentForm.controls.message.value
    ).then(
      (comment: INoticeComment) => {

          Swal.fire({
            icon: 'success',
            title: 'Comentario enviado con éxito',
          });

          this.commentForm.reset();
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

  canDelete(comment: INoticeComment): boolean {
    return this.userRole === UserRole.Admin ||
    this.userRole === UserRole.Super ||
    this.userUid === comment.userUid;
  }

  deleteComment(comment: INoticeComment): void {
    this.commentsSrv.deleteNoticeComment(comment.id);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
