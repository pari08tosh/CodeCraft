import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthguardService } from'./services/authguard.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { BlogService } from './services/blog.service';
import { UsersComponent } from './components/users/users.component';
import { WriteBlogComponent } from './components/write-blog/write-blog.component';
import { TinyEditorComponent } from './components/tiny-editor/tiny-editor.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { SearchComponent } from './components/search/search.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { CommentService } from './services/comment.service';
import { LearnComponent } from './components/learn/learn.component';
import { AddContentComponent } from './components/add-content/add-content.component';
import { LearnService } from './services/learn.service';
import { AddEbookComponent } from './components/add-ebook/add-ebook.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditContentComponent } from './components/edit-content/edit-content.component';
import { DiscussComponent } from './components/discuss/discuss.component';
import { AskQuestionComponent } from './components/ask-question/ask-question.component';
import { DiscussService } from './services/discuss.service';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionComponent } from './components/question/question.component';
import { WriteAnswerComponent } from './components/write-answer/write-answer.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { EditAnswerComponent } from './components/edit-answer/edit-answer.component';
import { MainService } from './services/main.service';
import { NotificationService } from './services/notification.service';
import { SearchPeopleComponent } from './components/search-people/search-people.component';
import { UrlErrorComponent } from './components/url-error/url-error.component';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { AddPlaylistComponent } from './components/add-playlist/add-playlist.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { EditPlaylistComponent } from './components/edit-playlist/edit-playlist.component';
import { ContentGuardService } from './services/content-guard.service';
import { FeedbackService } from './services/feedback.service';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewsFeedService } from './services/news-feed.service';
import { WriteFeedComponent } from './components/write-feed/write-feed.component';
import { AddSourceComponent } from './components/add-source/add-source.component';
import { TinyInputPipe } from './pipes/tiny-input.pipe';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { CodeComponent } from './components/code/code.component';
import { AceEditorModule } from 'ng2-ace-editor'
import { CodeService } from './services/code.service';
import { SubmissionComponent } from './components/submission/submission.component';
import { SearchCodeComponent } from './components/search-code/search-code.component';
import { AddStudyFileComponent } from './components/add-study-file/add-study-file.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:username', component: UsersComponent },
  { path: 'writeBlog', component: WriteBlogComponent, canActivate: [AuthguardService] },
  { path: 'tiny', component: TinyEditorComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogComponent},
  { path: 'editBlog', component: EditBlogComponent, canActivate: [AuthguardService] },
  { path: 'search', component: SearchComponent },
  { path: 'learn/:topic/:subtopic/:section', component: LearnComponent },
  { path: 'learn/:topic/:subtopic', component: LearnComponent },
  { path: 'learn/:topic', component: LearnComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'addContent/:topic/:subtopic', component: AddContentComponent, canActivate: [ContentGuardService]},
  { path: 'addContent/:topic', component: AddContentComponent, canActivate: [ContentGuardService]},
  { path: 'addContent', component: AddContentComponent, canActivate: [ContentGuardService]},
  { path: 'addEbook', component: AddEbookComponent, canActivate: [ContentGuardService] },
  { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthguardService] },
  { path: 'editContent/:topic/:subtopic/:section', component: EditContentComponent, canActivate: [ContentGuardService] },
  { path: 'editContent/:topic/:subtopic', component: EditContentComponent, canActivate: [ContentGuardService] },
  { path: 'editContent/:topic', component: EditContentComponent, canActivate: [ContentGuardService] },
  { path: 'askQuestion', component: AskQuestionComponent, canActivate: [AuthguardService] },
  { path: 'discuss', component: DiscussComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'question/:id', component: QuestionComponent },
  { path: 'writeAnswer/:id', component: WriteAnswerComponent, canActivate: [AuthguardService] },
  { path: "editQuestion", component: EditQuestionComponent, canActivate: [AuthguardService] },
  { path: "editAnswer", component: EditAnswerComponent },
  { path: "searchPeople", component: SearchPeopleComponent, canActivate: [AuthguardService] },
  { path: 'addVideo', component: AddVideoComponent, canActivate: [ContentGuardService] },
  { path: 'addPlaylist', component: AddPlaylistComponent, canActivate: [ContentGuardService] },
  { path: 'playlist/:topic/:subtopic/:name/:number', component: PlaylistComponent },
  { path: 'editPlaylist/:topic/:subtopic/:name', component: EditPlaylistComponent, canActivate: [ContentGuardService] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthguardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthguardService] },
  { path: 'addFeed', component: WriteFeedComponent, canActivate: [ContentGuardService] },
  { path: 'addSource', component: AddSourceComponent, canActivate: [ContentGuardService] },
  { path: 'code', component: CodeComponent, canActivate: [AuthguardService] },
  { path: 'submission/:id', component: SubmissionComponent, canActivate: [AuthguardService] },
  { path: 'searchCodes', component: SearchCodeComponent, canActivate: [AuthguardService] },
  { path: 'addStudyFile', component: AddStudyFileComponent, canActivate: [ContentGuardService] },


  // include all routes before this line
  { path: '404', component: UrlErrorComponent },
  { path: '**', redirectTo: '/404' },
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    BlogsComponent,
    ForgotPasswordComponent,
    UsersComponent,
    WriteBlogComponent,
    TinyEditorComponent,
    BlogComponent,
    EditBlogComponent,
    SearchComponent,
    BlogListComponent,
    LearnComponent,
    AddContentComponent,
    AddEbookComponent,
    EditProfileComponent,
    EditContentComponent,
    DiscussComponent,
    AskQuestionComponent,
    QuestionListComponent,
    QuestionComponent,
    WriteAnswerComponent,
    EditQuestionComponent,
    EditAnswerComponent,
    SearchPeopleComponent,
    UrlErrorComponent,
    AddVideoComponent,
    AddPlaylistComponent,
    PlaylistComponent,
    EditPlaylistComponent,
    FeedbackComponent,
    VideoPlayerComponent,
    DashboardComponent,
    WriteFeedComponent,
    AddSourceComponent,
    TinyInputPipe,
    CodeEditorComponent,
    CodeComponent,
    SubmissionComponent,
    SearchCodeComponent,
    AddStudyFileComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    AceEditorModule,
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthguardService,
    BlogService,
    CommentService,
    LearnService,
    DiscussService,
    MainService,
    NotificationService,
    ContentGuardService,
    FeedbackService,
    NewsFeedService,
    CodeService,
   ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
