create table projects
(
    id    int unsigned auto_increment
        primary key,
    title varchar(200) not null
);

create table jobs
(
    id           int unsigned auto_increment
        primary key,
    creationDate datetime default current_timestamp() not null,
    price        decimal(5, 2)                        not null,
    status       varchar(20)                          not null,
    projectId    int unsigned                         not null,
    constraint jobs_projects_id_fk
        foreign key (projectId) references projects (id)
            on delete cascade
);

create index jobs_status_index
    on jobs (status);

