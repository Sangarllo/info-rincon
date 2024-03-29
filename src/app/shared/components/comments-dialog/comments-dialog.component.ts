/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

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
  commentForm: UntypedFormGroup;
  public userUid: string;
  public userRole: string;
  public userEntities: string[] = [];
  public eventEntities: string[] = [];
  public entitiesIntersection: string[] = [];
  public commentType: CommentType;
  public comments$: Observable<IComment[]>;
  private listOfObservers: Array<Subscription> = [];

  commentator: any;
  commentatorAsUser: any;
  commentatorAsEntity: any;
  commentatorAsSuper: any;

  constructor(
    private fb: UntypedFormBuilder,
    private commentsSrv: CommentsService,
    public dialogRef: MatDialogRef<CommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.itemId = this.data.itemId;
    this.itemName = this.data.itemName;
    this.userUid = this.data.UserUid;
    this.userRole = this.data.UserRole;
    this.userEntities = this.data.UserEntities;
    this.eventEntities = this.data.EventEntities;
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

  canCommentAsAutor(): boolean {
    this.entitiesIntersection = this.userEntities.filter(entity => this.eventEntities.includes(entity));
    console.log(`entitiesIntersection: ${JSON.stringify(this.entitiesIntersection)}`);

    return ( this.entitiesIntersection.length > 0 );
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
