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

INSERT INTO projects (id, title) VALUES (1, 'project1');
INSERT INTO projects (id, title) VALUES (2, 'project0');
INSERT INTO projects (id, title) VALUES (3, 'project3');
INSERT INTO projects (id, title) VALUES (4, 'project2');
INSERT INTO projects (id, title) VALUES (5, 'project4');
INSERT INTO projects (id, title) VALUES (6, 'project5');
INSERT INTO projects (id, title) VALUES (7, 'project6');

INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (1, '2021-11-07 03:05:19', 3.42, 'cancelled', 1);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (2, '2021-10-16 15:36:07', 6.61, 'in progress', 1);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (3, '2021-11-16 23:03:31', 5.47, 'delivered', 1);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (4, '2021-10-26 16:59:19', 9.16, 'delivered', 6);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (5, '2022-03-28 10:50:32', 9.63, 'delivered', 6);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (6, '2021-06-04 05:54:08', 2.13, 'cancelled', 6);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (7, '2022-02-09 11:45:43', 8.19, 'in preparation', 6);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (8, '2021-04-12 02:01:41', 4.39, 'in progress', 4);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (9, '2021-06-18 02:31:23', 4.41, 'in preparation', 4);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (10, '2021-07-10 23:36:34', 1.19, 'delivered', 4);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (11, '2022-03-16 12:15:26', 3.05, 'in progress', 4);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (12, '2021-05-19 18:50:29', 8.35, 'in progress', 4);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (13, '2021-04-25 08:09:08', 1.57, 'cancelled', 3);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (14, '2022-04-07 15:07:47', 6.73, 'delivered', 3);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (15, '2021-08-02 09:10:48', 4.10, 'in progress', 5);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (16, '2021-12-05 19:27:55', 8.98, 'cancelled', 5);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (17, '2021-11-10 04:37:29', 8.23, 'in progress', 2);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (18, '2022-01-11 10:10:27', 8.17, 'in progress', 2);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (19, '2021-08-13 08:40:47', 9.32, 'in progress', 2);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (20, '2021-05-11 13:06:51', 9.78, 'delivered', 2);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (21, '2021-09-02 09:38:01', 3.52, 'delivered', 7);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (22, '2022-03-25 14:01:14', 0.77, 'in preparation', 7);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (23, '2022-02-11 16:53:42', 4.83, 'in preparation', 7);
INSERT INTO jobs (id, creationDate, price, status, projectId) VALUES (24, '2021-10-05 17:37:35', 0.25, 'cancelled', 7);
