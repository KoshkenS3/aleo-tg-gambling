program aleo_casino_v001.aleo;

struct MintSecret:
    amount as u128;
    nonce as u128;

record Token:
    owner as address.private;
    amount as u128.private;


mapping account:
	key as address.public;
	value as u128.public;


mapping already_minted:
	key as field.public;
	value as boolean.public;

function mint:
    input r0 as u128.private;
    input r1 as u128.private;
    input r2 as signature.private;
    input r3 as address.private;
    cast r0 r1 into r4 as MintSecret;
    sign.verify r2 aleo10eq9ur0r30884paxqmm85gy0e97ay264skpaqsnm0ye2glp5yvgswmrlqv r4 into r5;
    assert.eq r5 true;
    cast r3 r0 into r6 as Token.record;
    hash.bhp256 r4 into r7 as field;
    async mint r7 into r8;
    output r6 as Token.record;
    output r8 as aleo_casino_v001.aleo/mint.future;

finalize mint:
    input r0 as field.public;
    contains already_minted[r0] into r1;
    is.eq r1 false into r2;
    assert.eq r2 true;
    set true into already_minted[r0];


function transfer_public:
    input r0 as address.public;
    input r1 as u128.public;
    async transfer_public self.caller r0 r1 into r2;
    output r2 as aleo_casino_v001.aleo/transfer_public.future;

finalize transfer_public:
    input r0 as address.public;
    input r1 as address.public;
    input r2 as u128.public;
    get.or_use account[r0] 0u128 into r3;
    sub r3 r2 into r4;
    set r4 into account[r0];
    get.or_use account[r1] 0u128 into r5;
    add r5 r2 into r6;
    set r6 into account[r1];


function transfer_private:
    input r0 as Token.record;
    input r1 as address.private;
    input r2 as u128.private;
    sub r0.amount r2 into r3;
    cast r0.owner r3 into r4 as Token.record;
    cast r1 r2 into r5 as Token.record;
    output r4 as Token.record;
    output r5 as Token.record;


function transfer_private_to_public:
    input r0 as Token.record;
    input r1 as address.public;
    input r2 as u128.public;
    sub r0.amount r2 into r3;
    cast r0.owner r3 into r4 as Token.record;
    async transfer_private_to_public r1 r2 into r5;
    output r4 as Token.record;
    output r5 as aleo_casino_v001.aleo/transfer_private_to_public.future;

finalize transfer_private_to_public:
    input r0 as address.public;
    input r1 as u128.public;
    get.or_use account[r0] 0u128 into r2;
    add r2 r1 into r3;
    set r3 into account[r0];


function transfer_public_to_private:
    input r0 as address.public;
    input r1 as u128.public;
    cast r0 r1 into r2 as Token.record;
    async transfer_public_to_private self.caller r1 into r3;
    output r2 as Token.record;
    output r3 as aleo_casino_v001.aleo/transfer_public_to_private.future;

finalize transfer_public_to_private:
    input r0 as address.public;
    input r1 as u128.public;
    get.or_use account[r0] 0u128 into r2;
    sub r2 r1 into r3;
    set r3 into account[r0];
