/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { CommentType, IComment } from '@models/comment';
import { CommentsService } from '@services/comments.service';
import { UserRole } from '@models/user-role.enum';

@Component({
  selector: 'app-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.scss']
})
export class CommentsDialogComponent implements OnInit, OnDestroy {

  title = 'Últimos comentarios';
  errorMessage = '';
  public itemId: string;
  public itemName: string;
  comment: IComment;
  commentForm: FormGroup;
  public userUid: string;
  public userRole: string;
  public commentType: CommentType;
  public comments$: Observable<IComment[]>;
  private listOfObservers: Array<Subscription> = [];

  commentator: any;
  commentatorAsUser: any;
  commentatorAsEntity: any;
  commentatorAsSuper: any;

  constructor(
    private fb: FormBuilder,
    private commentsSrv: CommentsService,
    public dialogRef: MatDialogRef<CommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.itemId = this.data.itemId;
    this.itemName = this.data.itemName;
    this.userUid = this.data.UserUid;
    this.userRole = this.data.UserRole;
    this.commentType = this.data.commentType;
    this.comments$ = this.commentsSrv.getAllComments(this.itemId);

      this.commentForm = this.fb.group({
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
    this.commentsSrv.addComment(
        this.itemId,
        this.itemName,
        this.commentator.name,
        this.commentator.image,
        this.commentForm.controls.message.value,
        this.commentType,
    ).then(
      () => {

          Swal.fire({
            icon: 'success',
            title: 'Comentario enviado con éxito',
            text: `Publicado como ${this.commentator.name}`,
            confirmButtonColor: '#003A59',
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

  canDelete(comment: IComment): boolean {
    return this.userRole === UserRole.Admin ||
    this.userRole === UserRole.Super ||
    this.userUid === comment.userUid;
  }

  deleteComment(comment: IComment): void {
    this.commentsSrv.deleteComment(comment.id);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
