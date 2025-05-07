export interface Film {
  id: string;
  tmdb_id: number;
  title: string;
  slug: string;
  synopsis: string;
  poster_url: string | null;
  backdrop_url: string | null;
  note_sur_10: number;
  youtube_trailer_key: string | null;
  date_ajout: string;
  created_at?: string;
}

export interface RemarkableStaff {
  id: string;
  film_id: string;
  nom: string;
  role: string;
  photo_url: string | null;
  created_at?: string;
}

export interface FilmWithStaff extends Film {
  remarkable_staff: RemarkableStaff[];
}
