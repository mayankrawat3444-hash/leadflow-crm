const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLead } = require('../server');
const valid = {name:'Priya Sharma',email:'priya@example.com',phone:'+91 98765 43210',company:'Northstar Labs',source:'Website',status:'New'};
test('accepts a complete lead',()=>assert.deepEqual(validateLead(valid),{}));
test('requires all core fields',()=>{const errors=validateLead({});for(const key of ['name','email','phone','company','source','status'])assert.ok(errors[key]);});
test('rejects invalid email',()=>assert.match(validateLead({...valid,email:'not-an-email'}).email,/valid email/i));
test('rejects unsupported status',()=>assert.match(validateLead({...valid,status:'Maybe'}).status,/valid lead status/i));
