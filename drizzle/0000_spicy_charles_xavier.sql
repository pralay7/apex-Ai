CREATE TABLE "chat" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"frameId" varchar,
	"createdBy" varchar,
	"createdOn" timestamp DEFAULT now(),
	"chatMessages" json
);
--> statement-breakpoint
CREATE TABLE "frame" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "frame_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"frameId" varchar NOT NULL,
	"designeCode" text,
	"projectId" varchar,
	"createdOn" timestamp DEFAULT now(),
	CONSTRAINT "frame_frameId_unique" UNIQUE("frameId")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" varchar,
	"createdBy" varchar,
	"createdOn" timestamp DEFAULT now(),
	CONSTRAINT "projects_projectId_unique" UNIQUE("projectId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"credits" integer DEFAULT 2,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_frameId_frame_frameId_fk" FOREIGN KEY ("frameId") REFERENCES "public"."frame"("frameId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_createdBy_users_email_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frame" ADD CONSTRAINT "frame_projectId_projects_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("projectId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_createdBy_users_email_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;