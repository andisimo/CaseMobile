using CrmEarlyBound;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using Microsoft.Crm.Sdk.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;
using Microsoft.Xrm.Sdk;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestTaskObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string RegardingObjectId
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
        public bool IsComplete
        {//doing this to see what values come through
            get;
            set;
        }
    }

    public class TasksController : ApiController
    {
        // GET api/tasks
        public HttpResponseMessage Get(string RelatedId)
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from a in ctx.TaskSet
                        where a.RegardingObjectId.Id == new Guid(RelatedId)
                        select new CrmEarlyBound.Task
                        {
                            Id = a.Id,
                            RegardingObjectId = a.RegardingObjectId,
                            Subject = a.Subject,
                            StatusCode = a.StatusCode
                        };

            var queryResults = query.ToList();

            var listReturn = new List<TestTaskObject>();
            foreach (Task x in queryResults)
            {
                var returnObject = new TestTaskObject();
                returnObject.Id = x.Id;
                returnObject.RegardingObjectId = x.RegardingObjectId.Id.ToString();
                returnObject.Subject = x.Subject;

                if (x.StatusCode.Value == 5)
                {
                    returnObject.IsComplete = true;
                }
                else
                {
                    returnObject.IsComplete = false;
                }

                listReturn.Add(returnObject);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                listReturn);
        }

        public HttpResponseMessage Post(Guid taskId)
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var taskReference = new EntityReference("task", taskId);

            try
            {
                var req = new SetStateRequest();
                req.State = new OptionSetValue(1);
                req.Status = new OptionSetValue(5);
                req.EntityMoniker = taskReference;

                var res = (SetStateResponse)ctx.Execute(req);
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
