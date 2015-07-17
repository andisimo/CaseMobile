using CrmEarlyBound;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestAnnotationObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public Guid OwnerId
        {
            get;
            set;
        }

        [DataMember]
        public string OwnerName
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? CreatedOn
        {
            get;
            set;
        }

        [DataMember]
        public Guid ObjectId
        {
            get;
            set;
        }

        [DataMember]
        public string Subject
        {
            get;
            set;
        }

        [DataMember]
        public string NoteText
        {
            get;
            set;
        }
    }

    public class NotesController : ApiController
    {
        // GET api/notes
        public HttpResponseMessage Get(string RelatedId)
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://childsafety.crm.dynamics.com; Username=; Password=");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from a in ctx.AnnotationSet
                        where a.ObjectId.Id == new Guid(RelatedId)
                        select new TestAnnotationObject
                        {
                            Id = a.Id,
                            CreatedOn = a.CreatedOn,
                            OwnerId = a.OwnerId.Id,
                            OwnerName = a.OwnerId.Name,
                            ObjectId = a.ObjectId.Id,
                            Subject = a.Subject,
                            NoteText = a.NoteText
                        };

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                query);
        }

        // POST api/notes?caseId=
        public HttpResponseMessage Post(Guid caseId, string noteTitle, string noteText)
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://casemobile.crm.dynamics.com; Username=; Password=;");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var note = new Annotation();
            note.ObjectId = new CrmEntityReference("incident", caseId);
            note.Subject = noteTitle;
            note.NoteText = noteText;

            try
            {
                ctx.Create(note);
            }
            catch (Exception e)
            {
                return this.Request.CreateResponse(
                    HttpStatusCode.InternalServerError, e);
            }

            return this.Request.CreateResponse(
                HttpStatusCode.Created);
        }
    }
}
