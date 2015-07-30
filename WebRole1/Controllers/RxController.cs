﻿using CrmEarlyBound;
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
    public class TestRxObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string Name
        {
            get;
            set;
        }

        [DataMember]
        public string Description
        {
            get;
            set;
        }
    }

    public class RxController : ApiController
    {
        // GET api/rx
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from r in ctx.new_prescriptionSet
                        select new CrmEarlyBound.new_prescription
                        {
                            Id = r.Id,
                            new_name = r.new_name,
                            new_Description = r.new_Description
                        };

            var queryResults = query.ToList();

            var listReturn = new List<TestRxObject>();
            foreach (new_prescription x in queryResults)
            {
                var returnObject = new TestRxObject();
                returnObject.Id = x.Id;
                returnObject.Name = x.new_name;
                returnObject.Description = x.new_Description;

                listReturn.Add(returnObject);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                listReturn);
        }
    }
}
