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
    public class TestPictureObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public string CaseId
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

        [DataMember]
        public byte[] EntityImage
        {
            get;
            set;
        }
    }

    public class PicturesController : ApiController
    {
        // GET api/pictures
        public HttpResponseMessage Get(string RelatedId)
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://childsafety.crm.dynamics.com; Username=; Password=");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from p in ctx.new_pictureSet
                        where p.new_CaseId.Id == new Guid(RelatedId)
                        select new CrmEarlyBound.new_picture
                        {
                            Id = p.Id,
                            new_CaseId = p.new_CaseId,
                            new_Description = p.new_Description,
                            EntityImage = p.EntityImage
                        };

            var queryResults = query.ToList();

            var listReturn = new List<TestPictureObject>();
            foreach (new_picture x in queryResults)
            {
                var returnObject = new TestPictureObject();
                returnObject.Id = x.Id;
                returnObject.CaseId = x.new_CaseId.Id.ToString();
                returnObject.EntityImage = x.EntityImage;

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
