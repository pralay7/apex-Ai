import { timeStamp } from "console";
import { integer, json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
// this table stores the user information
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer().default(2)
});
// this table stores the data of out  project 
export const projectsTable =pgTable('projects',{// this defines the name of my database
  id: integer().primaryKey().generatedAlwaysAsIdentity(),//It defines a column for your database table that serves as a strictly managed, auto-incrementing unique identifier.
  projectId:varchar().unique(),
  createdBy:varchar().references(()=>usersTable.email),
  createdOn:timestamp().defaultNow()
})
//this table stores the different frames or parts of out response/ project
export const frametable= pgTable('frame',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  frameId:varchar().unique().notNull(),
  designeCode:text(),
  projectId:varchar().references(()=>projectsTable.projectId),
  createdOn:timestamp().defaultNow()
})
//this stores out chat for future reference 
export const chatTable=pgTable('chat',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  frameId:varchar().references(()=>frametable.frameId),
  createdBy:varchar().references(()=>usersTable.email),
  createdOn:timestamp().defaultNow(),
  chatMessages:json()


})
//after changes we use npx drizzle-kit push to update our changes