const chai = require('chai');
const assert = chai.assert;
const server = require('../index');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
    this.timeout(5000);
    let user;
    let userid;
    let folderid;
    let folderfileid;
    let userfileid;
    let measuredingredientid;
    let objectingredientid;
    
    suite(' User Routing tests', function () {
        suite('new user signup', function () {
           test('Test POST /api/user with email and password', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post("/api/user/newuser")
                    .send({ name: "testuser", email: 'email@example.com', password: "myPassword56*" })
                    .end(function (err, res) {
                        assert.equal(res.status, 201);
                        assert.equal(res.body.name, 'testuser');
                        assert.property(res.body, '_id', 'User object should contain _id');
                        done();
                    })
            });
            
            test('Test create new user with name not given', function (done) {
                chai.request(server)
                    .keepOpen()
                    .post("/api/user/newuser")
                    .send({ name: "", email: 'email@example2.com', password: " myPassword56*" })
                    .end(function (err, res) {
                        assert.equal(res.status, 400);
                        done();
                    });
            });
            test('Test create new user with email not given', function (done) {
                chai.request(server)
                    .keepOpen()
                    .post("/api/user/newuser")
                    .send({ name: "testuser", email: "", password: "myPassword56*" })
                    .end(function (err, res) {
                        assert.equal(res.status, 400);
                        done();
                    });
            });
            test('Test create new user with password not given', function (done) {
                chai.request(server)
                    .keepOpen()
                    .post("/api/user/newuser")
                    .send({ name: "testuser", email: 'email@example3.com', password: "" })
                    .end(function (err, res) {
                        assert.equal(res.status, 400);
                        done();
                    });
            });
        });
        suite('user Login', function () {
            test('Test POST /api/user with email and password', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post("/api/user/authenticate")
                    .send({ email: 'email@example.com', password: "myPassword56*" })
                    .end(function (err, res) {
                        userid = res.body._id;
                        user= res.body
                        assert.equal(res.status, 201);
                        assert.property(res.body, 'token', 'User object should contain a webtoken');
                        done();
                    })
            });

            test('Test login user with email not given', function (done) {
                chai.request(server)
                    .keepOpen()
                    .post("/api/user/authenticate")
                    .send({ email: "", password: "myPassword56*" })
                    .end(function (err, res) {
                        assert.equal(res.status, 400);
                        done();
                    });
            });
            test('Test login user with password not given', function (done) {
                chai.request(server)
                    .keepOpen()
                    .post("/api/user/authenticate")
                    .send({ email: 'email@example.com', password: "" })
                    .end(function (err, res) {
                        assert.equal(res.status, 400);
                        done();
                    });
            });
        });
    suite('Folder Routing tests', function () {
      suite('Create New Folder', function () {
         test('Test POST /api/folder create new folder with userid & name', function (done) {
              chai
                  .request(server)
                  .keepOpen()
                  .post("/api/folder")
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({ userid: userid, name: "TestFolder" })
                  .end(function (err, res) {
                      folderid = res.body._id;
                      assert.equal(res.status, 201);
                      assert.equal(res.body.name, 'TestFolder');
                      assert.property(res.body, '_id', 'Folder object should contain _id');
                      done();
                  })
          });

          test('Test create new folder with name not given', function (done) {
              chai.request(server)
                  .keepOpen()
                  .post("/api/folder")
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({ userid: userid, name: "" })
                  .end(function (err, res) {
                      assert.equal(res.status, 400);
                      done();
                  });
          });
          test('Test create new folder with userid not given', function (done) {
              chai.request(server)
                  .keepOpen()
                  .post("/api/folder")
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({ userid: "", name: "TestFolder" })
                  .end(function (err, res) {
                      assert.equal(res.status, 400);
                      done();
                  });
          });
      });
      suite('GET /api/folder', function () {
          test('Test GET /api/folder => get all folders', function (done) {
              chai.request(server)
                  .keepOpen()
                  .get(`/api/folder/allfolders?userid=${userid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.isArray(res.body, 'response should be an array');
                      assert.property(res.body[0], 'files', 'folders in array should contain files');
                      assert.property(res.body[0], 'name', 'folders in array should contain name');
                      assert.property(res.body[0], '_id', 'folders in array should contain _id');
                      assert.property(res.body[0], 'userid', 'folders in array should contain a userid');
                      done();
                  })
          });
      });

      suite('GET files', function () {
          test('Test GET no folder files', function (done) {
              chai.request(server)
                  .keepOpen()
                  .get(`/api/user/getuser?userid=${userid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.property(res.body, 'nofolderfiles');
                      assert.isArray(res.body.nofolderfiles, "user should conatin nofolderfiles array");
                      done();
                  })
          });

          test('Test GET foldered files', function (done) {
              chai.request(server)
                  .keepOpen()
                  .get(`/api/folder/allfolders?userid=${userid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.property(res.body[0], 'files', 'folders should contain files property');
                      assert.isArray(res.body[0].files, 'folders should contain files array');
                      done();
                  })
          });
      });

      suite('PUT /api/folder and /user', function () {
          test('Test put /api/user/newfile=>add new file to user nofolderfiles', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/user/newfile?userid=${userid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    fileName: "UserPassion",
                    servings: 21,
                    fileContent: " ",
                    LabourCost: 200,
                    LabourHours:2,
                    Overheads:200,
                    Profit:20,
                  })
                  .end(function (err, res) {
                      userfileid=res.body.nofolderfiles[res.body.nofolderfiles.length - 1]._id
                      assert.equal(res.status, 200);
                      assert.property(res.body, 'nofolderfiles', 'user should contain nofolderfiles array');
                      assert.property(res.body.nofolderfiles[res.body.nofolderfiles.length - 1], '_id', 'file should contain id');
                      assert.equal(res.body.nofolderfiles[res.body.nofolderfiles.length - 1].name, 'UserPassion')
                      done();
                  });
          });
          test('Test put /api/folder/newfile=>add new file to folder', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/folder?folderid=${folderid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    fileName: "FolderPassion",
                    fileContent: "",
                    servings: 1,
                    LabourCost: 0,
                    LabourHours: 0,
                    Overheads: 0,
                    Profit: 0,
                  })
                  .end(function (err, res) {
                      folderfileid=res.body.files[res.body.files.length - 1]._id
                      assert.equal(res.status, 200);
                      assert.property(res.body, 'files', 'folder should contain files array');
                      assert.property(res.body.files[res.body.files.length - 1], '_id', 'folder should contain an id');
                      assert.equal(res.body.files[res.body.files.length - 1].name, 'FolderPassion')
                      done();
                  });
          });
          test('Test put /api/folder/newfile=>edifilecontents in user nofolderfile', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/folder/editfilecontent?userid=${userid}&fileid=${userfileid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    name: 'Pina Colada 1kg',
                    servings: 25,
                    content: " ",
                    LabourCost: 200,
                    LabourHours: 3,
                    Overheads: 200,
                    Profit: 20,
                  })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.property(res.body, "nofolderfiles", 'file in USER nofolderfiles should be edited');
                      assert.equal(res.body.nofolderfiles[res.body.nofolderfiles.length - 1].name, 'Pina Colada 1kg')
                      done();
                  });
          });
          test('Test put /api/folder/newfile=>edifilecontents in the folder file', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/folder/editfilecontent?userid=${userid}&fileid=${folderfileid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    name: 'Orange 1kg',
                    servings: 25,
                    content: " ",
                    LabourCost: 200,
                    LabourHours: 3,
                    Overheads: 200,
                    Profit: 20,
                  })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.property(res.body, "files", 'file in FOLDER should be edited');
                      assert.equal(res.body.files[res.body.files.length - 1].name, 'Orange 1kg')
                      done();
                  });
          });
          test('Test put /api/folder/newfile=>edifilecontents with no userid', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/folder/editfilecontent?fileid=${userfileid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    name: 'Passion 1kg',
                    servings: 25,
                    content: " ",
                    LabourCost: 200,
                    LabourHours: 3,
                    Overheads: 200,
                    Profit: 20,
                  })
                  .end(function (err, res) {
                      assert.equal(res.status, 400);
                      done();
                  });
          });
          test('Test put /api/folder/newfile=>edifilecontents with no fileid', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/folder/editfilecontent?userid=${userid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    name: 'Passion 2kg',
                    servings: 25,
                    content: " ",
                    LabourCost: 200,
                    LabourHours: 3,
                    Overheads: 200,
                    Profit: 20,
                  })
                  .end(function (err, res) {
                      assert.equal(res.status, 400);
                      done();
                  });
          });
          test('Test put /api/folder/newfile=>edifilecontents with no body content', function (done) {
              chai.request(server)
                  .keepOpen()
                  .put(`/api/folder/editfilecontent?userid=${userid}&fileid=${userfileid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .send({
                    name: '',
                    servings: "",
                    content: "",
                    LabourCost: "",
                    LabourHours: "",
                    Overheads: "",
                    Profit: "",
                  })
                  .end(function (err, res) {
                      assert.equal(res.status, 400);
                      done();
                  });
          });
      });
      suite('DELETE /api/folder', function () {
          test('Test delete /api/folder=> delete file in folder', function (done) {
              chai.request(server)
                  .keepOpen()
                  .delete(`/api/folder/deletefile?userid=${userid}&fileid=${folderfileid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.text, 'file deleted from Folder');
                      done();
                  });
          });
          test('Test delete /api/folder=> delete file in user', function (done) {
              chai.request(server)
                  .keepOpen()
                  .delete(`/api/folder/deletefile?userid=${userid}&fileid=${userfileid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.text, 'file deleted from User');
                      done();
                  });
          });
          test('Test delete /api/folder=> delete folder', function (done) {
              chai.request(server)
                  .keepOpen()
                  .delete(`/api/folder?folderid=${folderid}`)
                  .set({ "Authorization": `Bearer ${user.token}` })
                  .end(function (err, res) {
                      assert.equal(res.status, 200);
                      assert.equal(res.text, "Folder has been deleted...");
                      done();
                  });
          });
      });
  });
  suite('Ingredient Routing tests', function () { 
    ///ingredient: new ingredient, get igredient, update ingredient, delete ingredient
    suite('Create New Ingredient', function () {
        test('Test POST /api/ingredient=> measurable ingredient', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post("/api/ingredient")
                .set({ "Authorization": `Bearer ${user.token}` })
                .send({ 
                    userid: userid,
                    name: "Gelatine",
                    density: 120,
                    packageCost: 200,
                    packageSize: 100,
                    packageUnit: 'g'
                 })
                .end(function (err, res) {
                    measuredingredientid = res.body._id;
                    assert.equal(res.status, 201);
                    assert.equal(res.body.name, 'gelatine');
                    assert.property(res.body, '_id', 'Ingredient object should contain _id');
                    done();
                })
        });
        test('Test POST /api/ingredient=> nonmeasurable object ingredient', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post("/api/ingredient")
                .set({ "Authorization": `Bearer ${user.token}` })
                .send({ 
                    userid: userid,
                    name: 'Oranges',
                    packageCost: 10,
                    packageContents: 1,
                 })
                .end(function (err, res) {
                    objectingredientid = res.body._id;
                    assert.equal(res.status, 201);
                    assert.equal(res.body.name, 'oranges');
                    assert.property(res.body, '_id', 'Ingredient object should contain _id');
                    done();
                })
        });

        test('Test create new Ingredient with userid not given', function (done) {
            chai.request(server)
                .keepOpen()
                .post("/api/folder")
                .set({ "Authorization": `Bearer ${user.token}` })
                .send({userid: "",
                    name: "CMC",
                    density: 120,
                    packageCost: 400,
                    packageSize: 100,
                    packageUnit: 'g'})
                .end(function (err, res) {
                    assert.equal(res.status, 400);
                    done();
                });
        });
    });
    suite('GET /api/ingredient', function () {
        test('Test GET /api/ingredient => get all ingredients', function (done) {
            chai.request(server)
                .keepOpen()
                .get("/api/ingredient")
                .set({ "Authorization": `Bearer ${user.token}` })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'response should be an array');
                    assert.property(res.body[0], '_id', 'ingredients in array should contain _id');
                    assert.property(res.body[0], 'userid', 'ingredients in array should contain a userid');
                    done();
                })
        });
    });

    suite('PUT /api/ingredient', function () {
        test('Test put /api/ingredient=>update ingredient', function (done) {
            chai.request(server)
                .keepOpen()
                .put(`/api/ingredient/${measuredingredientid}`)
                .set({ "Authorization": `Bearer ${user.token}` })
                .send({
                    userid: userid,
                    name: "Gelatine",
                    density: 120,
                    packageCost: 150,
                    packageSize: 100,
                    packageUnit: 'g'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.packageCost, 150)
                    done();
                });
        });
        
        test('Test put /api/ingredient=>edit object ingredient', function (done) {
            chai.request(server)
                .keepOpen()
                .put(`/api/ingredient/${objectingredientid}`)
                .set({ "Authorization": `Bearer ${user.token}` })
                .send({
                    userid: userid,
                    name: 'Oranges',
                    packageCost: 15,
                    packageContents: 1,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.packageCost, 15)
                    done();
                });
        });
        test('Test put /api/ingredient=>update with no body', function (done) {
            chai.request(server)
                .keepOpen()
                .put(`/api/ingredient/${objectingredientid}`)
                .set({ "Authorization": `Bearer ${user.token}` })
                .send({
                    userid: "",
                    name: "",
                    packageCost: "",
                    packageContents: ""
                })
                .end(function (err, res) {
                    assert.equal(res.status, 400);
                    done();
                });
        });
    });
    suite('DELETE /api/ingredient', function () {
        test('Test delete /api/ingredient=> delete measured ingredient', function (done) {
            chai.request(server)
                .keepOpen()
                .delete(`/api/ingredient/${measuredingredientid}`)
                .set({ "Authorization": `Bearer ${user.token}` })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'Ingredient has been deleted...');
                    done();
                });
        });
        test('Test put /api/ingredient=> delete object ingredient', function (done) {
            chai.request(server)
                .keepOpen()
                .delete(`/api/ingredient/${objectingredientid}`)
                .set({ "Authorization": `Bearer ${user.token}` })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'Ingredient has been deleted...');
                    done();
                });
        });
    });
    });
    suite('user delete account', function () {
        test('Test post/delete /api/user', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete(`/api/user/deleteuser?userid=${userid}`)
                .set({ "Authorization": `Bearer ${user.token}` })
                .end(function (err, res) {
                    assert.equal(res.status, 201);
                    assert.equal(res.text, 'User has been deleted...');
                    done();
                })
        });
    })
});
});
