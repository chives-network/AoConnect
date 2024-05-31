CurrentAddress: XhwDmvexqEdy984D5zXnQ2qfbaqard9kTXUuzqjm7Yg

Create Chatroom and other 5 users: Chatroom, AdminOne, AdminTwo, UserOne, UserTwo, UserThree

ChivesChatProcessTxId: SbgaGwS2Fra6iwdB5A5zL7cmKYiYnH8tCIYBffH9_hY

AdminOne: 29M1OluIZ2iVPNKr8bXV9p1WkQn51TUFAB0_wQ6pxBE

AdminTwo: _FoVxsaAdXkMaH7gplei1e6hlSVCyDXTqftSiDv3cPI

UserOne: J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A

UserTwo: IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q

UserThree: 0WcDJOEvXYvUyHXYNqRB9XtEGLfeBylmTkmgzMB22jQ

Wait seconds: 5s

Loading LoadBlueprint ChivesChat: ....................................................

LoadBlueprintChivesChat: Welcome to ChivesChat V0.1!

Main functoin:

1. Chatroom support three roles: owner, admin, member.
2. Owner: Can add or delete admins, add or delete channels, invite members (requiring user agreement), adding members, and deleting members.
3. Admin: Approval for joining the application, inviting members (requiring user agreement), adding members, and deleting members.
4. Member: Apply to join the chatroom, get approval from the admin, then send messages, and finally leave the chatroom.
5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.
6. Anyone can get channel information.
7. Only members can get information on all members.
8. This version of the message is public, not encrypted.

Have fun, be respectful !

Testing Admin Role: ....................................................

ChivesChatAdmins1st(Empty): { }

ChivesChatAddAdminOne: message added to outbox

ChivesChatAdmins2nd(1 Admin): { "29M1OluIZ2iVPNKr8bXV9p1WkQn51TUFAB0_wQ6pxBE" }

ChivesChatAddAdminTwo: Successfully add administrator

ChivesChatAdmins3rd(2 Admins): { "29M1OluIZ2iVPNKr8bXV9p1WkQn51TUFAB0_wQ6pxBE", "_FoVxsaAdXkMaH7gplei1e6hlSVCyDXTqftSiDv3cPI" }

ChivesChatDelAdminOne: Successfully delete administrator

ChivesChatAdmins4th(1 Admin, Left AdminTwo): { "_FoVxsaAdXkMaH7gplei1e6hlSVCyDXTqftSiDv3cPI" }

Testing Invite: ....................................................

ChivesChatAddInviteUserOne: Successfully invite member

ChivesChatAddInviteUserTwo: Successfully invite member

ChivesChatAddInviteUserThree: Successfully invite member

GetChivesChatInvitesList1st(3 Invites): {
IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q = {
MemberId = "IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q",
MemberReason = "Interesting This Chatroom",
MemberName = "UserTwo"
},
0WcDJOEvXYvUyHXYNqRB9XtEGLfeBylmTkmgzMB22jQ = {
MemberId = "0WcDJOEvXYvUyHXYNqRB9XtEGLfeBylmTkmgzMB22jQ",
MemberReason = "Interesting This Chatroom",
MemberName = "UserThree"
},
J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A = {
MemberId = "J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A",
MemberReason = "Hope join this chatroom",
MemberName = "UserOne"
}
}

ChivesChatUserOneAgreeInvite: You have joined the chatroom SbgaGwS2Fra6iwdB5A5zL7cmKYiYnH8tCIYBffH9_hY

ChivesChatUserTwoRefuseInvite: You have refused the chatroom SbgaGwS2Fra6iwdB5A5zL7cmKYiYnH8tCIYBffH9_hY

GetChivesChatInvitesList2nd(1 invite, Left UserThree): {
0WcDJOEvXYvUyHXYNqRB9XtEGLfeBylmTkmgzMB22jQ = {
MemberId = "0WcDJOEvXYvUyHXYNqRB9XtEGLfeBylmTkmgzMB22jQ",
MemberReason = "Interesting This Chatroom",
MemberName = "UserThree"
}
}

ChivesChatUserThreeRefuseInvite: You have refused the chatroom SbgaGwS2Fra6iwdB5A5zL7cmKYiYnH8tCIYBffH9_hY

GetChivesChatInvites3nd(Empty): { }

GetChivesChatMembersByOwner1st(1 member): {
J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A = {
MemberId = "J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A",
MemberReason = "Hope join this chatroom",
MemberName = "UserOne"
}
}

Testing Apply: ....................................................

ChivesChatUserTwoApplyJoin: You have refused the chatroom SbgaGwS2Fra6iwdB5A5zL7cmKYiYnH8tCIYBffH9_hY

ChivesChatUserThreeApplyJoin: Your application has been submitted and is awaiting administrator approval

ChivesChatAdminTwoApprovalApplyUserTwo: User successfully approved IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q

ChivesChatAdminTwoRefuseApplyUserThree: You have refused user UserThree entry to this chatroom SbgaGwS2Fra6iwdB5A5zL7cmKYiYnH8tCIYBffH9_hY

GetChivesChatMembersByOwner2st(2 members, UserOne and UserTwo): {
IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q = {
MemberId = "IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q",
MemberReason = "Hope join this chatroom",
MemberName = "UserTwo"
},
J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A = {
MemberId = "J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A",
MemberReason = "Hope join this chatroom",
MemberName = "UserOne"
}
}

Testing Members: ....................................................

UserFour: 9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0

UserFive: VSUmocMAmUD_AQdLGnuIhn-5xFNeeRdyKmLW1VrhcGE

ChivesChatAdminTwoAddUserFour: User successfully join the chatroom 9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0

ChivesChatAdminTwoAddUserFive: User successfully join the chatroom 9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0

GetChivesChatMembersByOwner3rd(4 members, UserOne, UserTwo, UserFour, UserFive): {
VSUmocMAmUD_AQdLGnuIhn-5xFNeeRdyKmLW1VrhcGE = {
MemberId = "VSUmocMAmUD_AQdLGnuIhn-5xFNeeRdyKmLW1VrhcGE",
MemberReason = "UserFive Reason",
MemberName = "UserFive"
},
IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q = {
MemberId = "IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q",
MemberReason = "Hope join this chatroom",
MemberName = "UserTwo"
},
9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0 = {
MemberId = "9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0",
MemberReason = "UserFour Reason",
MemberName = "UserFour"
},
J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A = {
MemberId = "J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A",
MemberReason = "Hope join this chatroom",
MemberName = "UserOne"
}
}

ChivesChatAdminTwoDelUserFive: Member successfully removed

GetChivesChatMembersByOwner4th(3 members, UserOne, UserTwo, UserFour): {
IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q = {
MemberId = "IdyZYp5d7NkO4KNG0dtyZTK1uWm2kXm1grpjMRN2O7Q",
MemberReason = "Hope join this chatroom",
MemberName = "UserTwo"
},
9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0 = {
MemberId = "9eMjqLHwvQ29IdamOScBFrhza7JAF8ftvJNy1c5ndg0",
MemberReason = "UserFour Reason",
MemberName = "UserFour"
},
J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A = {
MemberId = "J15d0fP12_ZKmlPmzGVyj-4ZQUMDK_MKJ9XQgsXpK_A",
MemberReason = "Hope join this chatroom",
MemberName = "UserOne"
}
}

Testing Channel: ....................................................

ChivesChatAddChannel1: Successfully add a channel

ChivesChatAddChannel2: Successfully add a channel

ChivesChatAddChannel3: Successfully add a channel

ChivesChatAddChannel4: Successfully add a channel

ChivesChatAddChannel5: Successfully add a channel

ChivesChatAddChannel6: Successfully add a channel

ChivesChatGetChannelsData(2 channels): {"6":{"ChannelSort":"6","ChannelName":"Admin Team","ChannelId":"6","ChannelGroup":"Administrators"},"5":{"ChannelSort":"5","ChannelName":"Support","ChannelId":"5","ChannelGroup":"Community"},"4":{"ChannelSort":"4","ChannelName":"Community","ChannelId":"4","ChannelGroup":"Community"},"3":{"ChannelSort":"3","ChannelName":"Introduction","ChannelId":"3","ChannelGroup":"Introduction"},"2":{"ChannelSort":"2","ChannelName":"Rules","ChannelId":"2","ChannelGroup":"Welcome"},"1":{"ChannelSort":"1","ChannelName":"Announcement","ChannelId":"1","ChannelGroup":"Welcome"}}

Testing Finished: ===================================================