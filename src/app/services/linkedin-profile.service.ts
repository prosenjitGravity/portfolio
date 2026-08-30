import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface LinkedinProfile {
  name: string;
  headline?: string;
  location?: string;
  connections?: string | number;
  followers?: string | number;
  avatarUrl?: string;
  bannerUrl?: string;
  about?: string;
  profileUrl: string;
  currentCompany?: string;
  school?: string;
  openToWork?: boolean;
}

export interface LinkedinExperience {
  role: string;
  company: string;
  period?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
}

export interface LinkedinEducation {
  school: string;
  degree?: string;
  period?: string;
  logoUrl?: string;
}

export interface LinkedinActivity {
  author: string;
  headline?: string;
  avatarUrl?: string;
  time?: string;
  text: string;
  likes?: number;
  comments?: number;
}

export interface LinkedinProfileResponse {
  profile: LinkedinProfile;
  experience?: LinkedinExperience[];
  education?: LinkedinEducation[];
  activities?: LinkedinActivity[];
}

@Injectable({ providedIn: 'root' })
export class LinkedinProfileService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<LinkedinProfileResponse> {
    return this.http.get<LinkedinProfileResponse>(environment.linkedinProfileApiUrl);
  }
}
